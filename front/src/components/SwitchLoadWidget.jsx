import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export default function SwitchLoadWidget() {
  const svgRef = useRef(null);
  const [switches, setSwitches] = useState([]);

  // Генерация фейковых данных
  useEffect(() => {
    const fakeSwitches = Array.from({ length: 12 }, (_, i) => {
      const load = Math.floor(Math.random() * 100);
      return {
        name: `SW-${i + 1}`,
        load,
        traffic: Math.floor(Math.random() * 10000), // Мбит/с
        portsUsed: Math.floor(Math.random() * 48),
        totalPorts: 48,
      };
    });
    setSwitches(fakeSwitches);
  }, []);

  useEffect(() => {
    if (!svgRef.current || switches.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const margin = { top: 20, right: 10, bottom: 20, left: 100 };

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const sorted = [...switches].sort((a, b) => b.load - a.load).slice(0, 10);

    const x = d3.scaleLinear().domain([0, 100]).range([0, chartWidth]);
    const y = d3.scaleBand()
      .domain(sorted.map((d) => d.name))
      .range([0, chartHeight])
      .padding(0.2);

    const color = (load) =>
      load > 90 ? "#f44336" : load > 70 ? "#ff9800" : "#4caf50";

    g.append("g")
      .call(d3.axisLeft(y).tickSize(0))
      .selectAll("text")
      .style("fill", "#eee")
      .style("font-size", "12px");

    g.selectAll("rect")
      .data(sorted)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", (d) => y(d.name))
      .attr("width", (d) => x(d.load))
      .attr("height", y.bandwidth())
      .attr("fill", (d) => color(d.load));

    g.selectAll("text.load")
      .data(sorted)
      .enter()
      .append("text")
      .attr("x", (d) => x(d.load) + 5)
      .attr("y", (d) => y(d.name) + y.bandwidth() / 2 + 4)
      .text((d) => `${d.load}%`)
      .style("fill", "#eee")
      .style("font-size", "11px");
  }, [switches]);

  const total = switches.length;
  const critical = switches.filter((s) => s.load > 90).length;
  const totalTraffic = switches.reduce((sum, s) => sum + s.traffic, 0);

  return (
    <div
      style={{
        boxSizing: "border-box",
        width: "100%",
        height: "100%",
        background: "#1f1f1f",
        color: "#eee",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        fontFamily: "Inter, sans-serif",
        borderRight: "1px solid #333",
        overflow: "scroll"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, fontSize: "18px" }}>📶 Нагрузка на коммутаторы</h2>
        <div style={{ fontSize: "12px", color: "#aaa" }}>{new Date().toLocaleTimeString()}</div>
      </div>

      <div style={{ display: "flex", gap: "20px", fontSize: "13px" }}>
        <div>Активные: <strong>{total}</strong></div>
        <div>Перегруженные: <strong style={{ color: critical > 0 ? "#f44336" : "#4caf50" }}>{critical}</strong></div>
        <div>Трафик: <strong>{(totalTraffic / 1024).toFixed(2)} Гбит/с</strong></div>
      </div>

      <div style={{ flex: 1 }}>
        <svg ref={svgRef} width="100%" height="100%" />
      </div>

      <div style={{ fontSize: "12px", color: "#ccc", marginTop: "8px" }}>
        {switches.slice(0, 5).map((s) => (
          <div
            key={s.name}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "2px 0",
              borderBottom: "1px solid #333",
            }}
          >
            <div style={{ color: "#eee" }}>{s.name}</div>
            <div>{s.portsUsed}/{s.totalPorts} портов</div>
            <div style={{ color: s.load > 90 ? "#f44336" : s.load > 70 ? "#ff9800" : "#4caf50" }}>
              {s.load}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
