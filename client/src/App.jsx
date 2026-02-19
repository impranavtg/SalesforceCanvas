import { useAuth } from './hooks/useCanvasContext';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';

export default function App() {
    const { user, loading, login, logout } = useAuth();

    if (loading) {
        return (
            <div className="loading-state">
                <div className="spinner" />
                <p>Checking session…</p>
            </div>
        );
    }

    if (!user) {
        return <LoginPage onLogin={login} />;
    }

    return <Dashboard user={user} onLogout={logout} />;
}
