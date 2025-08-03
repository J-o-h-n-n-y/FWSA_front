import React, { useState, useEffect, useMemo } from 'react';

const fetchAlerts = () => {
  const now = Date.now();
  return [
    {
      id: 1,
      time: '2019-10-04 04:05:46',
      severity: 'Information',
      recoveryTime: null,
      status: 'PROBLEM',
      info: 'Interface 170: Ethernet has changed to lower speed than it was before',
      host: 'Switch HP 2530-48g',
      problem: 'Interface 170: Ethernet has changed to lower speed than it was before',
      duration: '5h 20m 56s',
      ack: 'No',
      tags: ['Environment: DEV'],
      tooltip: `Last value: 10 Mbps.\nThis Ethernet connection has transitioned down from its known maximum speed. This might be a sign of autonegotiation issues. Ack to close.`,
    },
    {
      id: 2,
      time: '2019-09-27 14:05:55',
      severity: 'Warning',
      recoveryTime: null,
      status: 'PROBLEM',
      info: 'mp Survivor Space fully committed on Testing JMX Template',
      host: 'Testing JMX Template',
      problem: 'mp Survivor Space fully committed on Testing JMX Template',
      duration: '9d 19h 20m',
      ack: 'No',
      tags: ['Application: JAVA'],
      tooltip: 'Garbage collector warning',
    },
    // Можно добавить больше объектов для теста
  ];
};

// Стили для severity
const severityColors = {
  Information: '#4a90e2',
  Warning: '#f5a623',
  // Добавить error, critical и т.д., если нужно
};

// Стили для status
const statusColors = {
  PROBLEM: '#e74c3c',
  RESOLVED: '#27ae60',
};

const AlertPanel = () => {
  const [alerts, setAlerts] = useState([]);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    setAlerts(fetchAlerts());
    const interval = setInterval(() => {
      setAlerts(fetchAlerts());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredSortedAlerts = useMemo(() => {
    let filtered = alerts;
    if (filterSeverity !== 'all') {
      filtered = filtered.filter(a => a.severity === filterSeverity);
    }
    return filtered.sort((a, b) =>
      sortAsc
        ? new Date(a.time) - new Date(b.time)
        : new Date(b.time) - new Date(a.time)
    );
  }, [alerts, filterSeverity, sortAsc]);

  return (
    <div style={{ width: "100%", height: "100%", fontFamily: 'Arial, sans-serif', fontSize: 14, color: '#ccc', backgroundColor: '#222'}}>
      <h2 style={{ color: '#eee' }}>Alert Panel</h2>

      <div style={{ marginBottom: 15 }}>
        <label style={{ marginRight: 10 }}>Filter Severity:</label>
        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          style={{ padding: 5, borderRadius: 4, border: '1px solid #444', backgroundColor: '#333', color: '#eee' }}
        >
          <option value="all">All</option>
          <option value="Information">Information</option>
          <option value="Warning">Warning</option>
          {/* Можно добавить больше */}
        </select>

        <button
          onClick={() => setSortAsc(!sortAsc)}
          style={{
            marginLeft: 15,
            padding: '5px 10px',
            backgroundColor: '#444',
            border: 'none',
            borderRadius: 4,
            color: '#eee',
            cursor: 'pointer',
          }}
          title="Toggle sort order by Time"
        >
          Sort by Time: {sortAsc ? 'Ascending' : 'Descending'}
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', color: '#ccc' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #555', padding: '8px' }}>Time</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #555', padding: '8px' }}>Severity</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #555', padding: '8px' }}>Status</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #555', padding: '8px' }}>Host</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #555', padding: '8px' }}>Problem</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #555', padding: '8px' }}>Duration</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #555', padding: '8px' }}>Ack</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #555', padding: '8px' }}>Tags</th>
          </tr>
        </thead>
        <tbody>
          {filteredSortedAlerts.length === 0 && (
            <tr>
              <td colSpan={8} style={{ textAlign: 'center', padding: 15, color: '#777' }}>
                No alerts found.
              </td>
            </tr>
          )}
          {filteredSortedAlerts.map((alert) => (
            <tr key={alert.id} style={{ borderBottom: '1px solid #444' }}>
              <td style={{ padding: 8, whiteSpace: 'nowrap' }}>{alert.time}</td>

              <td
                style={{
                  padding: 8,
                  backgroundColor: severityColors[alert.severity] || '#555',
                  color: '#fff',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  cursor: 'default',
                }}
                title={alert.severity}
              >
                {alert.severity}
              </td>

              <td
                style={{
                  padding: 8,
                  color: statusColors[alert.status] || '#ccc',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}
              >
                {alert.status}
              </td>

              <td style={{ padding: 8, color: '#6eb6ff', cursor: 'pointer' }} title={`Host: ${alert.host}`}>
                <u>{alert.host}</u>
              </td>

              <td style={{ padding: 8, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={alert.tooltip}>
                {alert.problem}
              </td>

              <td style={{ padding: 8, whiteSpace: 'nowrap' }}>{alert.duration}</td>

              <td style={{ padding: 8, color: alert.ack === 'Yes' ? '#2ecc71' : '#e74c3c', fontWeight: 'bold', textAlign: 'center' }}>
                {alert.ack}
              </td>

              <td style={{ padding: 8 }}>
                {alert.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    style={{
                      backgroundColor: '#444',
                      color: '#ccc',
                      borderRadius: 3,
                      padding: '2px 6px',
                      marginRight: 4,
                      fontSize: 12,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AlertPanel;
