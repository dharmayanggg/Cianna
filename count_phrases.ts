import Database from "better-sqlite3";

const db = new Database("database.sqlite");

try {
  const result = db.prepare("SELECT COUNT(*) as count FROM dictionary").get() as { count: number };
  console.log(`Total dictionary entries: ${result.count}`);
} catch (error) {
  console.error("Error counting dictionary entries:", error);
}
