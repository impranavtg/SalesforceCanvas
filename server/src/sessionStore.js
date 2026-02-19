import crypto from 'node:crypto';

const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes

class SessionStore {
    constructor() {
        this.sessions = new Map();

        // Cleanup expired sessions every 5 minutes
        this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
    }

    create(canvasContext) {
        const token = crypto.randomBytes(32).toString('hex');
        this.sessions.set(token, {
            context: canvasContext,
            createdAt: Date.now(),
        });
        return token;
    }

    get(token) {
        const session = this.sessions.get(token);
        if (!session) return null;

        if (Date.now() - session.createdAt > SESSION_TTL_MS) {
            this.sessions.delete(token);
            return null;
        }

        return session.context;
    }

    delete(token) {
        this.sessions.delete(token);
    }

    cleanup() {
        const now = Date.now();
        for (const [token, session] of this.sessions) {
            if (now - session.createdAt > SESSION_TTL_MS) {
                this.sessions.delete(token);
            }
        }
    }

    destroy() {
        clearInterval(this.cleanupInterval);
        this.sessions.clear();
    }
}

export const sessionStore = new SessionStore();
