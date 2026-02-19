export default function ContextPanel({ context }) {
    if (!context) return null;

    const { user, organization, environment } = context;

    return (
        <div className="panel">
            <div className="panel-header">
                <h2><span className="panel-icon">👤</span> User & Organization</h2>
            </div>
            <div className="panel-body">
                <div className="info-grid">
                    <InfoItem label="Full Name" value={user.fullName} />
                    <InfoItem label="Username" value={user.userName} accent />
                    <InfoItem label="Email" value={user.email} />
                    <InfoItem label="User ID" value={user.userId} accent />
                    <InfoItem label="Organization" value={organization.name} />
                    <InfoItem label="Org ID" value={organization.organizationId} accent />
                    <InfoItem label="Locale" value={user.locale} />
                    <InfoItem label="Language" value={user.language} />
                    <InfoItem label="Time Zone" value={user.timeZone} />
                    <InfoItem label="Currency" value={organization.currencyIsoCode} />
                    <InfoItem label="Display Location" value={environment.displayLocation} />
                    <InfoItem label="API Version" value={environment.version?.api} />
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
