import { useState } from 'react';

export default function LoginPage({ onLogin, loading: authLoading }) {
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token.trim()) return;

        setLoading(true);
        setError(null);

        try {
            await onLogin(token.trim());
        } catch (err) {
            setError('Authentication failed. Invalid or expired token.');
            setLoading(false);
        }
    };

    const handleGetMockToken = async () => {
        setLoading(true);
        setError(null);

        try {
            const API_BASE = import.meta.env.VITE_API_BASE || '';
            const res = await fetch(`${API_BASE}/canvas/mock`, { method: 'POST' });
            if (!res.ok) throw new Error('Mock endpoint unavailable');
            const data = await res.json();
            setToken(data.token);
            setLoading(false);
        } catch (err) {
            setError('Could not generate mock token. Is the server running with MOCK_MODE=true?');
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="app-logo">SF</div>
                    <h1>Canvas Test App</h1>
                    <p>Enter your session token to access the dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-field">
                        <label htmlFor="token">Session Token</label>
                        <input
                            id="token"
                            type="text"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            placeholder="Paste your session token here..."
                            autoFocus
                            disabled={loading}
                        />
                    </div>

                    {error && <div className="login-error">{error}</div>}

                    <button type="submit" className="btn btn--primary btn--full" disabled={loading || !token.trim()}>
                        {loading ? '⟳ Authenticating…' : '🔐 Authenticate'}
                    </button>
                </form>


            </div>
        </div>
    );
}
