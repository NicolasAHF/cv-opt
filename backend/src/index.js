import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'

// Importa las rutas (asegúrate de que las rutas tengan la extensión .js)
import authRoutes from './routes/authRoutes.js';
import cvRoutes from './routes/cvRoutes.js';

const app = express();

app.use(cors({
    origin: true,
    credentials: true,
  }));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/cv', cvRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
