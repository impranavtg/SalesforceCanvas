import { useState, useEffect } from 'react';
import { apiFetch } from '../hooks/useCanvasContext';

export default function Dashboard({ user, onLogout }) {
    const [accounts, setAccounts] = useState(null);
    const [accountsLoading, setAccountsLoading] = useState(false);

    const fetchAccounts = () => {
        setAccountsLoading(true);
        apiFetch('/api/accounts')
            .then(setAccounts)
            .catch(() => { })
            .finally(() => setAccountsLoading(false));
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    return (
        <div className="app">
            <header className="app-header">
                <div className="app-logo">SF</div>
                <h1>Canvas Dashboard</h1>
                <div className="header-right">
                    <span className="badge badge--live badge--dot">Authenticated</span>
                    <button className="btn btn--secondary btn--sm" onClick={onLogout}>Logout</button>
                </div>
            </header>

            {/* User & Org Info */}
            <div className="panels">
                <div className="panel">
                    <div className="panel-header">
                        <h2><span className="panel-icon">👤</span> User Info</h2>
                    </div>
                    <div className="panel-body">
                        <div className="info-grid">
                            <InfoItem label="Full Name" value={user.user?.fullName} />
                            <InfoItem label="Username" value={user.user?.userName} accent />
                            <InfoItem label="Email" value={user.user?.email} />
                            <InfoItem label="User ID" value={user.user?.userId} accent />
                            <InfoItem label="Locale" value={user.user?.locale} />
                            <InfoItem label="Time Zone" value={user.user?.timeZone} />
                        </div>
                    </div>
                </div>

                <div className="panel">
                    <div className="panel-header">
                        <h2><span className="panel-icon">🏢</span> Organization</h2>
                    </div>
                    <div className="panel-body">
                        <div className="info-grid">
                            <InfoItem label="Org Name" value={user.organization?.name} />
                            <InfoItem label="Org ID" value={user.organization?.organizationId} accent />
                            <InfoItem label="Currency" value={user.organization?.currencyIsoCode} />
                            <InfoItem label="Instance URL" value={user.instanceUrl} accent />
                            <InfoItem label="Display Location" value={user.environment?.displayLocation} />
                            <InfoItem label="API Version" value={user.environment?.version?.api} />
                        </div>
                    </div>
                </div>

                {/* Accounts Table */}
                <div className="panel panel--full">
                    <div className="panel-header">
                        <h2><span className="panel-icon">📊</span> Salesforce Accounts</h2>
                        <button className="btn btn--sm btn--secondary" onClick={fetchAccounts} disabled={accountsLoading}>
                            {accountsLoading ? '⟳ Loading…' : '↻ Refresh'}
                        </button>
                    </div>
                    <div className="panel-body">
                        {accounts && (
                            <>
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Industry</th>
                                            <th>Annual Revenue</th>
                                            <th>Website</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {accounts.records.map((acc) => (
                                            <tr key={acc.Id}>
                                                <td>{acc.Name}</td>
                                                <td>{acc.Industry || '—'}</td>
                                                <td>{acc.AnnualRevenue ? `$${acc.AnnualRevenue.toLocaleString()}` : '—'}</td>
                                                <td>
                                                    {acc.Website ? (
                                                        <a href={acc.Website} target="_blank" rel="noreferrer" style={{ color: 'var(--color-accent-hover)' }}>
                                                            {acc.Website.replace(/https?:\/\//, '')}
                                                        </a>
                                                    ) : '—'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="table-source">
                                    {accounts.source === 'mock' ? '⚠️ Mock data' : '✅ Live Salesforce data'}
                                    {' · '}{accounts.totalSize} record{accounts.totalSize !== 1 ? 's' : ''}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoItem({ label, value, accent }) {
    return (
        <div className="info-item">
            <div className="info-label">{label}</div>
            <div className={`info-value${accent ? ' info-value--accent' : ''}`}>
                {value || '—'}
            </div>
        </div>
    );
}
