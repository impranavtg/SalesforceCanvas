import { Router } from 'express';
import crypto from 'node:crypto';
import { verifyAndDecode } from '../canvasAuth.js';
import { sessionStore } from '../sessionStore.js';
import { MOCK_CANVAS_CONTEXT } from '../mockData.js';

const router = Router();

/**
 * GET /canvas
 * Fallback when accessed directly (not via Salesforce POST).
 */
router.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
      <head><title>Canvas Endpoint</title></head>
      <body style="font-family:sans-serif;padding:40px;text-align:center;color:#333">
        <h2>Salesforce Canvas Endpoint</h2>
        <p>This endpoint expects a <strong>POST</strong> request with a <code>signed_request</code> from Salesforce.</p>
        <p>If you're seeing this, the server is running correctly.</p>
      </body>
    </html>
  `);
});

/**
 * POST /canvas
 * Salesforce sends the signed_request here when the Canvas app is loaded.
 */
router.post('/', (req, res) => {
    const { signed_request } = req.body;

    console.log("Got signed request");

    if (!signed_request) {
        return res.status(400).json({ error: 'Missing signed_request in body' });
    }

    try {
        const canvasContext = verifyAndDecode(
            signed_request,
            process.env.CONSUMER_SECRET
        );

        console.log("Verified signed request");

        const token = sessionStore.create(canvasContext);
        const redirectUrl = `${process.env.CLIENT_URL}?token=${token}`;

        console.log("Redirecting now");

        // Server-side redirect — no client-side JS needed
        res.redirect(redirectUrl);
    } catch (err) {
        console.error('Canvas signed request verification failed:', err.message);
        res.status(401).json({ error: 'Invalid signed request' });
    }
});

/**
 * POST /canvas/mock
 * Dev-only endpoint: simulates a Canvas signed request flow.
 * Allows local testing without a real Salesforce org.
 */
router.post('/mock', (req, res) => {
    if (process.env.MOCK_MODE !== 'true') {
        return res.status(404).json({ error: 'Mock mode is disabled' });
    }

    const token = sessionStore.create(MOCK_CANVAS_CONTEXT);
    res.json({ token, redirectUrl: `${process.env.CLIENT_URL}?token=${token}` });
});

/**
 * GET /canvas/mock
 * Convenience: creates mock session and redirects to client directly.
 */
router.get('/mock', (req, res) => {
    if (process.env.MOCK_MODE !== 'true') {
        return res.status(404).json({ error: 'Mock mode is disabled' });
    }

    const token = sessionStore.create(MOCK_CANVAS_CONTEXT);
    res.redirect(`${process.env.CLIENT_URL}?token=${token}`);
});

export default router;
