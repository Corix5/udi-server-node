import express from "express";
const router = express.Router();
const db = require("../db/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
import Joi from "joi";

// Definir el esquema de validación
const adminSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

// Ruta para la autenticación del usuario
router.post("/", async (req, res) => {
  // Validar los datos de entrada
  const { error, value } = adminSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { username, password } = value;

  try {
    // Buscar al usuario en la base de datos
    const [rows] = await db.query("SELECT * FROM admins WHERE username = ?", [
      username,
    ]);
    
    // Si no se encuentra el usuario, devolver un error
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = rows[0];

    // Comparar la contraseña ingresada con la almacenada en la base de datos
    const isMatch = await bcrypt.compare(password, user.password);
    
    // Si las contraseñas no coinciden, devolver un error
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Crear el token JWT
    const token = jwt.sign({ id: user.id, username: user.username }, "your_secret_key", {
      expiresIn: "1h", // El token expira en 1 hora
    });

    // Devolver el token al cliente
    res.status(200).json({ token });

  } catch (error) {
    // Manejo de errores
    let errorMessage = "Unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ error: errorMessage });
  }

  return;
});

export default router;
