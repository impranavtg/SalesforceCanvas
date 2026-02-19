import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || '';

export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const checkSession = (token) => {
        setLoading(true);
        setError(null);

        return fetch(`${API_BASE}/api/userinfo?token=${token}`)
            .then((res) => {
                if (!res.ok) throw new Error('Invalid or expired token');
                return res.json();
            })
            .then((data) => {
                sessionStorage.setItem('canvas_token', token);
                setUser(data);
                setLoading(false);
                return data;
            })
            .catch((err) => {
                sessionStorage.removeItem('canvas_token');
                setUser(null);
                setError(err.message);
                setLoading(false);
                throw err;
            });
    };

    const login = (token) => checkSession(token);

    const logout = () => {
        sessionStorage.removeItem('canvas_token');
        setUser(null);
        setError(null);
    };

    // Check for existing token on mount
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token') || sessionStorage.getItem('canvas_token');

        if (token) {
            checkSession(token).catch(() => { });
        } else {
            setLoading(false);
        }
    }, []);

    return { user, loading, error, login, logout };
}

export function getToken() {
    return sessionStorage.getItem('canvas_token');
}

export function apiFetch(path) {
    const token = getToken();
    return fetch(`${API_BASE}${path}?token=${token}`).then((res) => {
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
    });
}
