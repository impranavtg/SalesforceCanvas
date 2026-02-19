import { Router } from 'express';
import crypto from 'node:crypto';
import { verifyAndDecode } from '../canvasAuth.js';
import { sessionStore } from '../sessionStore.js';
import { MOCK_CANVAS_CONTEXT } from '../mockData.js';

const router = Router();

/**
 * POST /canvas
 * Salesforce sends the signed_request here when the Canvas app is loaded.
 */
router.post('/', (req, res) => {
    const { signed_request } = req.body;

    if (!signed_request) {
        return res.status(400).json({ error: 'Missing signed_request in body' });
    }

    try {
        const canvasContext = verifyAndDecode(
            signed_request,
            process.env.CONSUMER_SECRET
        );

        const token = sessionStore.create(canvasContext);
        const redirectUrl = `${process.env.CLIENT_URL}?token=${token}`;

        // Respond with an HTML page that redirects via JS (Canvas loads in iframe)
        res.send(`
      <!DOCTYPE html>
      <html>
        <head><title>Loading Canvas App...</title></head>
        <body>
          <script>window.top.location.href = "${redirectUrl}";</script>
        </body>
      </html>
    `);
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
