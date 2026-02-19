import { useState, useCallback } from 'react';

export default function EventsPanel({ instanceUrl }) {
    const [log, setLog] = useState([]);

    const addLog = useCallback((type, message) => {
        const now = new Date().toLocaleTimeString();
        setLog((prev) => [{ time: now, type, message }, ...prev].slice(0, 50));
    }, []);

    const canvasAvailable = typeof window !== 'undefined' && window.Sfdc?.canvas;

    const publishEvent = (name, payload) => {
        if (canvasAvailable) {
            try {
                window.Sfdc.canvas.client.publish(
                    { name, payload },
                );
                addLog(name, `Published: ${JSON.stringify(payload)}`);
            } catch (err) {
                addLog('ERROR', err.message);
            }
        } else {
            addLog(name, `[Simulated] Would publish: ${JSON.stringify(payload)}`);
        }
    };

    return (
        <div className="panel">
            <div className="panel-header">
                <h2><span className="panel-icon">⚡</span> Canvas Events</h2>
                {!canvasAvailable && (
                    <span className="badge badge--mock badge--dot">Simulated</span>
                )}
            </div>
            <div className="panel-body">
                <div className="btn-group">
                    <button
                        className="btn btn--primary"
                        onClick={() => publishEvent('canvas.refresh', { target: 'feed' })}
                    >
                        🔄 Refresh Feed
                    </button>
                    <button
                        className="btn btn--teal"
                        onClick={() =>
                            publishEvent('canvas.navigate', {
                                url: `${instanceUrl || ''}/lightning/o/Account/list`,
                            })
                        }
                    >
                        📋 Go to Accounts
                    </button>
                    <button
                        className="btn btn--secondary"
                        onClick={() =>
                            publishEvent('canvas.custom', {
                                action: 'test_event',
                                timestamp: Date.now(),
                            })
                        }
                    >
                        🧪 Custom Event
                    </button>
                </div>

                <div className="event-log">
                    {log.length === 0 ? (
                        <div className="event-log-empty">No events fired yet. Click a button above.</div>
                    ) : (
                        log.map((entry, i) => (
                            <div className="event-entry" key={i}>
                                <span className="event-time">{entry.time}</span>
                                <span className="event-type">{entry.type}</span>
                                <span className="event-msg">{entry.message}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
