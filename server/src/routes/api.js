import { Router } from 'express';
import jsforce from 'jsforce';
import { sessionStore } from '../sessionStore.js';
import { MOCK_ACCOUNTS } from '../mockData.js';

const router = Router();

/** Auth middleware — validates the session token from cookie or Authorization header */
function requireSession(req, res, next) {
    const token =
        req.cookies?.canvas_token ||
        req.headers.authorization?.replace('Bearer ', '') ||
        req.query.token;

    if (!token) {
        return res.status(401).json({ error: 'Missing session token' });
    }

    const context = sessionStore.get(token);
    if (!context) {
        return res.status(401).json({ error: 'Invalid or expired session' });
    }

    req.canvasContext = context;
    next();
}

router.use(requireSession);

/**
 * GET /api/userinfo
 * Returns the decoded Canvas context (user, org, environment info).
 */
router.get('/userinfo', (req, res) => {
    const { context, client } = req.canvasContext;
    res.json({
        user: context.user,
        organization: context.organization,
        environment: context.environment,
        links: context.links,
        instanceUrl: client.instanceUrl,
    });
});



/**
 * GET /api/status
 * Health check / status info.
 */
router.get('/status', (req, res) => {
    res.json({
        connected: true,
        mockMode: process.env.MOCK_MODE === 'true',
        timestamp: new Date().toISOString(),
    });
});

export default router;
