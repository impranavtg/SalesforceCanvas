

export default function Dashboard({ user, onLogout }) {

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
                            <InfoItem label="Currency" value={user.organization?.currencyIsoCode} />
                            <InfoItem label="Display Location" value={user.environment?.displayLocation} />
                            <InfoItem label="API Version" value={user.environment?.version?.api} />
                        </div>
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
