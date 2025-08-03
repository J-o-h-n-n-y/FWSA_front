export default function NetworkOverview({ total, up, avgLatency, packetLoss, alerts }) {
  const percent = total === 0 ? 0 : Math.round((up / total) * 100);
  const down = total - up;
  const barColor = percent > 90 ? "#4caf50" : percent > 70 ? "#ff9800" : "#f44336";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: "0.75rem 1.5rem",
        background: "#2c2c2c",
        color: "#f5f5f5",
        borderBottom: "1px solid #444",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "2rem",
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.95rem",
        flexWrap: "wrap",
      }}
    >
      <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600, whiteSpace: "nowrap" }}>
        Обзор сети
      </h2>

      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
        <span>🖧 Всего: <strong>{total}</strong></span>
        <span style={{ color: "#4caf50" }}>🟢 В сети: <strong>{up}</strong></span>
        <span style={{ color: "#f44336" }}>🔴 Нет связи: <strong>{down}</strong></span>
        <span style={{ color: "#81d4fa" }}>⏱ Задержка: <strong>{avgLatency ?? "—"} ms</strong></span>
        <span style={{ color: "#ffb74d" }}>📉 Потери: <strong>{packetLoss ?? "—"}%</strong></span>
        <span style={{ color: "#ff1744" }}>⚠️ Алерты: <strong>{alerts ?? 0}</strong></span>
      </div>

      <div style={{ textAlign: "right", minWidth: 160 }}>
        <p style={{ marginBottom: 6, fontSize: "0.85rem", color: "#ccc" }}>Доступность</p>
        <div
          style={{
            background: "#444",
            borderRadius: 6,
            overflow: "hidden",
            height: 12,
            width: "100%",
            marginBottom: 4,
          }}
        >
          <div
            style={{
              background: barColor,
              height: "100%",
              width: `${percent}%`,
              transition: "width 0.3s ease",
            }}
          />
        </div>
        <p style={{ fontSize: "1rem", fontWeight: 600, color: barColor }}>{percent}%</p>
      </div>
    </div>
  );
}
