import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("database.sqlite");

// Migration: Ensure product_id column and COMPOSITE UNIQUE constraint exist
const tableInfo = db.prepare("PRAGMA table_info(licenses)").all() as any[];
const tableExists = tableInfo.length > 0;

let hasProductId = false;
let hasCorrectUnique = false;

if (tableExists) {
  hasProductId = tableInfo.some(col => col.name === "product_id");

  // Check if the unique constraint is on (phone_number, product_id)
  const indexList = db.prepare("PRAGMA index_list(licenses)").all() as any[];
  for (const idx of indexList) {
    if (idx.unique) {
      const idxInfo = db.prepare(`PRAGMA index_info(${idx.name})`).all() as any[];
      const columns = idxInfo.map(c => c.name);
      if (columns.includes("phone_number") && columns.includes("product_id") && columns.length === 2) {
        hasCorrectUnique = true;
        break;
      }
    }
  }
} else {
  // Table doesn't exist, so we don't need to migrate. 
  // The CREATE TABLE IF NOT EXISTS block below will handle it correctly.
  hasProductId = true; 
  hasCorrectUnique = true;
}

if (!hasProductId || !hasCorrectUnique) {
  try {
    console.log("Migration: Starting migration to fix schema/constraints...");
    // Perform a proper migration to add column and unique constraint
    db.transaction(() => {
      // 1. Create new table with correct schema
      db.exec(`
        CREATE TABLE IF NOT EXISTS licenses_new (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          phone_number TEXT,
          product_id INTEGER,
          license_key TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(phone_number, product_id)
        )
      `);

      // 2. Copy data from old table
      // We use COALESCE(product_id, 1) to handle cases where product_id might be missing
      const columnsInOld = tableInfo.map(c => c.name);
      const selectCols = columnsInOld.includes("product_id") 
        ? "id, phone_number, license_key, created_at, product_id"
        : "id, phone_number, license_key, created_at, 1 as product_id";

      db.exec(`
        INSERT OR IGNORE INTO licenses_new (id, phone_number, license_key, created_at, product_id)
        SELECT ${selectCols} FROM licenses
      `);

      // 3. Drop old table
      db.exec("DROP TABLE licenses");

      // 4. Rename new table
      db.exec("ALTER TABLE licenses_new RENAME TO licenses");
    })();
    console.log("Migration: Successfully migrated licenses table to new schema");
  } catch (e) {
    console.log("Migration: Table might not exist yet or migration failed, skipping...", e);
  }
}

// Initialize database (fallback/ensure)
db.exec(`
  CREATE TABLE IF NOT EXISTS licenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone_number TEXT,
    product_id INTEGER,
    license_key TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(phone_number, product_id)
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS dictionary (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT,
    indo TEXT,
    mandarin TEXT,
    pronunciation TEXT,
    is_custom INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API: Get Dictionary
  app.get("/api/dictionary", (req, res) => {
    try {
      const phrases = db.prepare("SELECT * FROM dictionary ORDER BY category, indo").all();
      res.json(phrases);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dictionary" });
    }
  });

  // API: Save Phrase
  app.post("/api/dictionary", (req, res) => {
    const { category, indo, mandarin, pronunciation } = req.body;
    if (!indo || !mandarin) {
      return res.status(400).json({ error: "Missing fields" });
    }
    try {
      // Check if exists
      const existing = db.prepare("SELECT id FROM dictionary WHERE indo = ?").get(indo);
      if (existing) {
        return res.json({ success: true, message: "Already exists" });
      }

      db.prepare("INSERT INTO dictionary (category, indo, mandarin, pronunciation, is_custom) VALUES (?, ?, ?, ?, 1)")
        .run(category || "General", indo, mandarin, pronunciation || "");
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to save phrase" });
    }
  });

  // API: Generate License Key
  app.post("/api/generate-license", (req, res) => {
    const { phoneNumber, productId, secretToken } = req.body;

    if (secretToken !== "CIANNA_SECRET_2023") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (!phoneNumber || !productId) {
      return res.status(400).json({ error: "Phone number and Product ID are required" });
    }

    try {
      // Check if license already exists
      const existing = db.prepare("SELECT license_key FROM licenses WHERE phone_number = ? AND product_id = ?").get(phoneNumber, productId) as { license_key: string } | undefined;
      
      if (existing) {
        return res.json({ licenseKey: existing.license_key, message: "License already exists" });
      }

      // Generate a new license key: ANNA{productId}-{random}
      const randomPart = crypto.randomBytes(2).toString("hex").toUpperCase();
      const licenseKey = `ANNA${productId}-${randomPart}`;

      db.prepare("INSERT INTO licenses (phone_number, product_id, license_key) VALUES (?, ?, ?)").run(phoneNumber, productId, licenseKey);

      res.json({ licenseKey });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // API: Validate License Key
  app.post("/api/validate-license", (req, res) => {
    const { phoneNumber, licenseKey, productId } = req.body;

    if (!phoneNumber || !licenseKey || !productId) {
      return res.status(400).json({ error: "Missing credentials" });
    }

    const license = db.prepare("SELECT * FROM licenses WHERE phone_number = ? AND license_key = ? AND product_id = ?").get(phoneNumber, licenseKey, productId);

    if (license) {
      res.json({ valid: true });
    } else {
      res.status(401).json({ valid: false, error: "Invalid license key for this product" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
