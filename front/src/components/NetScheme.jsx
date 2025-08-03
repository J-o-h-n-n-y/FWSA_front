import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import {
  FaDesktop,
  FaServer,
  FaNetworkWired
} from 'react-icons/fa';

const initialNodes = [
  { id: 'Switch1', type: 'switch' },
  { id: 'Switch2', type: 'switch' },
  { id: 'PC1', type: 'pc' },
  { id: 'PC2', type: 'pc' },
  { id: 'PC3', type: 'pc' },
  { id: 'PC4', type: 'pc' },
  { id: 'Server', type: 'server' }
];

const linksData = [
  { source: 'PC1', target: 'Switch1' },
  { source: 'PC2', target: 'Switch1' },
  { source: 'PC3', target: 'Switch1' },
  { source: 'PC4', target: 'Switch1' },
  { source: 'Switch1', target: 'Switch2' },
  { source: 'Switch2', target: 'Server' }
];

const iconByType = {
  pc: <FaDesktop size={30} color="#ffc107" />,
  server: <FaServer size={30} color="#4caf50" />,
  switch: <FaNetworkWired size={30} color="#00bcd4" />
};

const NetworkGraph = () => {
  const svgRef = useRef(null);
  const [nodes, setNodes] = useState(initialNodes.map(n => ({ ...n })));
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const width = 800;
    const height = 500;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // очистка svg

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(linksData).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const drag = d3.drag()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    // Невидимые circle-узлы — только для drag
    const invisibleNodes = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 20)
      .attr('fill', 'transparent')
      .call(drag);

    const linkElements = svg.append('g')
      .selectAll('line')
      .data(linksData)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.6);

    simulation.on('tick', () => {
      linkElements
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      invisibleNodes
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      // обновляем позиции иконок
      setNodes([...nodes]);
    });

    setLinks(linksData); // один раз, чтобы React знал

    return () => simulation.stop();
  }, []);

  return (
    <div
      style={{
        position: '',
        width: 800,
        height: 500,
        border: '1px solid #ccc'
      }}
    >
      <svg ref={svgRef} width={800} height={500} style={{ position: 'absolute', top: 0, left: 0 }} />
      {nodes.map((node) => (
        <div
          key={node.id}
          style={{
            position: 'absolute',
            left: (node.x || 0) - 15,
            top: (node.y || 0) - 15,
            width: 60,
            textAlign: 'center',
            pointerEvents: 'none'
          }}
        >
          {iconByType[node.type]}
          <div style={{ fontSize: 10 }}>{node.id}</div>
        </div>
      ))}
    </div>
  );
};

export default NetworkGraph;
