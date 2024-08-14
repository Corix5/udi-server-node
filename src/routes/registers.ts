import express from "express";
const router = express.Router();
const db = require("../db/db");
import Joi from "joi";

const registerSchema = Joi.object({
  student_id: Joi.number().integer().required(), // Validación para student_id
  equipment_id: Joi.number().integer().required(), // Validación para equipment_id
  date: Joi.date().required(), // Validación para date
  entry_time: Joi.string()
    .pattern(/^\d{2}:\d{2}:\d{2}$/)
    .required(), // Validación para entry_time en formato HH:MM:SS
  departure_time: Joi.string()
    .pattern(/^\d{2}:\d{2}:\d{2}$/)
    .allow(null), // Validación para departure_time, puede ser null
  comment: Joi.string().allow(null), // Validación para comment, puede ser null
});

const updateSchema = Joi.object({
  equipment_id: Joi.number().integer().required(),
  date: Joi.date().required(),
  entry_time: Joi.string().required(),
  departure_time: Joi.string().optional(),
  comment: Joi.string().optional(),
});

router.post("/", async (req, res) => {
  const { error, value } = registerSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const {
    student_id,
    equipment_id,
    date,
    entry_time,
    departure_time,
    comment,
  } = value;

  try {
    const [result] = await db.query(
      "INSERT INTO register (student_id, equipment_id, date, entry_time, departure_time, comment) VALUES (?, ?, ?, ?, ?, ?)",
      [student_id, equipment_id, date, entry_time, departure_time, comment]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    let errorMessage = "Unknown error occurred";
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
    const [rows] = await db.query(`
      SELECT
        register.id AS register_id,
        student.id AS student_id,
        student.name,
        student.id_number,
        student.email,
        equipment.id AS equipment_id,
        equipment.equipment_name,
        equipment.state,
        register.date,
        register.entry_time,
        register.departure_time,
        register.comment
      FROM
        register
        JOIN student ON register.student_id = student.id
        JOIN equipment ON register.equipment_id = equipment.id
    `);
    res.status(200).json(rows);
  } catch (error) {
    let errorMessage = "Unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ error: errorMessage });
  }
});

// Read one
router.get("/:student_id/:register_id", async (req, res) => {
  const { student_id, register_id } = req.params;

  try {
    const [rows] = await db.query(
      `
      SELECT
        register.id AS register_id,
        student.id AS student_id,
        student.name,
        student.id_number,
        student.email,
        equipment.id AS equipment_id,
        equipment.equipment_name,
        equipment.state,
        register.date,
        register.entry_time,
        register.departure_time,
        register.comment
      FROM
        register
        JOIN student ON register.student_id = student.id
        JOIN equipment ON register.equipment_id = equipment.id
      WHERE
        student.id = ? and register.id = ?;
    `,
      [student_id, register_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json(rows);
  } catch (error) {
    let errorMessage = "Unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ error: errorMessage });
  }

  return; // Add this line
});

// Update
router.put("/:student_id/:register_id", async (req, res) => {
  const { student_id, register_id } = req.params;
  const { value } = updateSchema.validate(req.body);
  const { equipment_id, date, entry_time, departure_time, comment } = value;

  try {
    const [result] = await db.query(
      `
      UPDATE register
      SET equipment_id = ?, date = ?, entry_time = ?, departure_time = ?, comment = ?
      WHERE student_id = ? AND id = ?
    `,
      [
        equipment_id,
        date,
        entry_time,
        departure_time,
        comment,
        student_id,
        register_id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Register not found" });
    }

    return res.status(200).json({ message: "Register updated successfully" });
  } catch (error) {
    let errorMessage = "Unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ error: errorMessage });
  }
});


// Delete
router.delete("/:student_id/:register_id", async (req, res) => {
  const { student_id, register_id } = req.params;

  try {
    const [result] = await db.query(`
      DELETE FROM register WHERE student_id = ? AND id = ?
    `, [student_id, register_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Register not found" });
    }

    res.status(200).json({ message: "Register deleted successfully" });
  } catch (error) {
    let errorMessage = 'Unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ error: errorMessage });
  }

  return; // Add this line
});

//Delete all
router.delete("/", async (_req, res) => {
  try {
    const [] = await db.query("DELETE FROM register");
    res.status(200).json({ message: "Registers deleted successfully" });
  } catch (error) {
    let errorMessage = "Unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ error: errorMessage });
  }
});

export default router;
