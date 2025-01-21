import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import songRoutes from './routes/songs.js';
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import playlistsRoutes from './routes/playlists.js';
import compression from 'compression';
import { fileURLToPath } from 'url';
 
const app = express(); 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.join(__dirname, '../client/dist');
const corsOptions = {
    origin: true,
    credentials: true,
};

// Middleware setup
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(compression({ level: 9 }));
app.use(express.static(clientDistPath));

// API routes
app.use('/api/songs', songRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/playlists', playlistsRoutes);

app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
