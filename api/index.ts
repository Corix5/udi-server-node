import express from "express";
const cors = require('cors');
import studentRouter from "../src/routes/students";
import equipmentRouter from "../src/routes/equipments";
import registerRouter from "../src/routes/registers";
import adminRouter from "../src/routes/admin";

const app = express();

// Configuración del middleware CORS para aceptar solicitudes desde cualquier origen
app.use(cors());

// Middleware personalizado para configurar los headers de CORS de forma más detallada
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Middleware para transformar req.body en JSON
app.use(express.json());

// Manejo explícito para solicitudes OPTIONS (si es necesario)
app.options('*', cors());

// Rutas
app.get('/', (_req, res) => {
    res.send('Hello World');
});

app.use('/api/students', studentRouter);
app.use('/api/equipments', equipmentRouter);
app.use('/api/registers', registerRouter);
app.use('/api/login', adminRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`El servidor está en el puerto ${PORT}`);
});
