import express from "express";
const router = express.Router();
const db = require("../db/db");
import Joi from "joi";

const studentSchema = Joi.object({
  name: Joi.string().required(),
  id_number: Joi.string().required(),
  email: Joi.string().email().required(),
});

router.post("/", async (req, res) => {
  const { error, value } = studentSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const {
    name,
    id_number,
    email,
  } = value;

  try {
    const [result] = await db.query(
      "INSERT INTO student (name, id_number, email) VALUES (?, ?, ?)",
      [
        name,
        id_number,
        email,
      ]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error: unknown) {
    let errorMessage = 'Unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ error: errorMessage });
  }

  return;
});

// Read all
router.get("/", async (_req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM student");
    res.status(200).json(rows);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Unknown error occurred" });
    }
  }
});

// Read one
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM student WHERE id = ?", [id]);
    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ error: "Alumno not found" });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Unknown error occurred" });
    }
  }
});

// Update
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    name,
    id_number,
    email,
  } = req.body;
  try {
    const [result] = await db.query(
      "UPDATE student SET name = ?, id_number = ?, email = ? WHERE id = ?",
      [
        name,
        id_number,
        email,
        id,
      ]
    );
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Alumno updated" });
    } else {
      res.status(404).json({ error: "Alumno not found" });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Unknown error occurred" });
    }
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM student WHERE id = ?", [id]);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Alumno deleted" });
    } else {
      res.status(404).json({ error: "Alumno not found" });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Unknown error occurred" });
    }
  }
});

export default router;
