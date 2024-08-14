import express from "express";
const router = express.Router();
const db = require("../db/db");

// Read all
router.get("/", async (_req, res) => {
    try {
      const [rows] = await db.query("SELECT * FROM equipment");
      res.status(200).json(rows);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Unknown error occurred" });
      }
    }
  });

  export default router;