import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import songRoutes from './routes/songs.js';
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import playlistsRoutes from './routes/playlists.js';
import compression from 'compression';
const app = express();

app.use(express.json());
const corsOptions = {
    origin: true,
    credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(compression({ level: 9 }));

const port = 3000;

app.use('/api/songs', songRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/playlists', playlistsRoutes)

app.get('/', (req, res) => {
    res.send("HI");
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
