import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import canvasRoutes from './routes/canvas.js';
import apiRoutes from './routes/api.js';

const app = express();

// --------------- Middleware ---------------
app.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:5175',
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --------------- Routes ---------------
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', mockMode: process.env.MOCK_MODE === 'true' });
});

app.use('/canvas', canvasRoutes);
app.use('/api', apiRoutes);

// --------------- Start ---------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`\n🚀 Canvas Server running on http://localhost:${PORT}`);
    console.log(`   Mock mode: ${process.env.MOCK_MODE === 'true' ? 'ENABLED' : 'DISABLED'}`);
    console.log(`   Client URL: ${process.env.CLIENT_URL || 'http://localhost:5175'}\n`);
});

export default app;
