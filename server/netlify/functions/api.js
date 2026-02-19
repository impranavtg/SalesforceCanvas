import serverless from 'serverless-http';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import canvasRoutes from '../../src/routes/canvas.js';
import apiRoutes from '../../src/routes/api.js';

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL || '*',
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/health', (_req, res) => {
    res.json({ status: 'ok', mockMode: process.env.MOCK_MODE === 'true' });
});

app.use('/canvas', canvasRoutes);
app.use('/api', apiRoutes);

export const handler = serverless(app);
