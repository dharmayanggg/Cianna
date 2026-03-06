import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase Configuration
let supabaseClient: any = null;

function getSupabase() {
  if (!supabaseClient) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY environment variables are required.");
    }
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API: Get Dictionary
  app.get("/api/dictionary", async (req, res) => {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("dictionary")
        .select("*")
        .order("category", { ascending: true })
        .order("indo", { ascending: true });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error("Supabase Error:", error);
      res.status(500).json({ error: "Failed to fetch dictionary" });
    }
  });

  // API: Save Phrase
  app.post("/api/dictionary", async (req, res) => {
    const { category, indo, mandarin, pronunciation } = req.body;
    if (!indo || !mandarin) {
      return res.status(400).json({ error: "Missing fields" });
    }
    try {
      const supabase = getSupabase();
      // Check if exists
      const { data: existing } = await supabase
        .from("dictionary")
        .select("id")
        .eq("indo", indo)
        .single();

      if (existing) {
        return res.json({ success: true, message: "Already exists" });
      }

      const { error } = await supabase
        .from("dictionary")
        .insert([{ 
          category: category || "General", 
          indo, 
          mandarin, 
          pronunciation: pronunciation || "",
          is_custom: true 
        }]);

      if (error) throw error;
      res.json({ success: true });
    } catch (error) {
      console.error("Supabase Error:", error);
      res.status(500).json({ error: "Failed to save phrase" });
    }
  });

  // API: Generate License Key
  app.post("/api/generate-license", async (req, res) => {
    const { phoneNumber, productId, secretToken } = req.body;

    if (secretToken !== "CIANNA_SECRET_2023") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (!phoneNumber || !productId) {
      return res.status(400).json({ error: "Phone number and Product ID are required" });
    }

    try {
      const supabase = getSupabase();
      // Check if license already exists
      const { data: existing } = await supabase
        .from("licenses")
        .select("license_key")
        .eq("phone_number", phoneNumber)
        .eq("product_id", productId)
        .single();
      
      if (existing) {
        return res.json({ licenseKey: existing.license_key, message: "License already exists" });
      }

      // Generate a new license key: ANNA{productId}-{random}
      const randomPart = crypto.randomBytes(2).toString("hex").toUpperCase();
      const licenseKey = `ANNA${productId}-${randomPart}`;

      const { error } = await supabase
        .from("licenses")
        .insert([{ phone_number: phoneNumber, product_id: productId, license_key: licenseKey }]);

      if (error) throw error;

      res.json({ licenseKey });
    } catch (error) {
      console.error("Supabase Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // API: Validate License Key
  app.post("/api/validate-license", async (req, res) => {
    const { phoneNumber, licenseKey, productId } = req.body;

    if (!phoneNumber || !licenseKey || !productId) {
      return res.status(400).json({ error: "Missing credentials" });
    }

    try {
      const supabase = getSupabase();
      const { data: license, error } = await supabase
        .from("licenses")
        .select("*")
        .eq("phone_number", phoneNumber)
        .eq("license_key", licenseKey)
        .eq("product_id", productId)
        .single();

      if (error && error.code !== "PGRST116") throw error; // PGRST116 is "no rows returned"

      if (license) {
        res.json({ valid: true });
      } else {
        res.status(401).json({ valid: false, error: "Invalid license key for this product" });
      }
    } catch (error) {
      console.error("Supabase Error:", error);
      res.status(500).json({ error: "Database validation error" });
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
