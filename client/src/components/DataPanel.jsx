import { useState, useEffect } from 'react';
import { apiFetch } from '../hooks/useCanvasContext';

export default function DataPanel() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAccounts = () => {
        setLoading(true);
        setError(null);
        apiFetch('/api/accounts')
            .then(setData)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    return (
        <div className="panel panel--full">
            <div className="panel-header">
                <h2><span className="panel-icon">📊</span> Salesforce Accounts</h2>
                <button className="btn btn--sm btn--secondary" onClick={fetchAccounts} disabled={loading}>
                    {loading ? '⟳ Loading…' : '↻ Refresh'}
                </button>
            </div>
            <div className="panel-body">
                {error && <p style={{ color: 'var(--color-error)' }}>{error}</p>}
                {data && (
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
                                {data.records.map((acc) => (
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
                            {data.source === 'mock' ? '⚠️ Mock data' : '✅ Live Salesforce data'}
                            {' · '}{data.totalSize} record{data.totalSize !== 1 ? 's' : ''}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
