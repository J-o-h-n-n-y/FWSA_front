import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function PingChart({ data }) {
  const ref = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); // Очистка

    const width = 300;
    const height = 150;
    const margin = { top: 20, right: 20, bottom: 20, left: 40 };

    const x = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data) || 1])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const line = d3
      .line()
      .x((_, i) => x(i))
      .y((d) => y(d))
      .curve(d3.curveMonotoneX);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat((d) => `${d}s`));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5).tickFormat((d) => `${d}ms`));

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#4caf50")
      .attr("stroke-width", 2)
      .attr("d", line);
  }, [data]);

  return <svg ref={ref} width={300} height={150} />;
}
