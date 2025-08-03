import React, { useRef, useState, useEffect } from "react";
import { nanoid } from "nanoid";
import * as API from "../../API"; // путь подкорректируй под структуру проекта
import SelectionIcon from "../../icons/SelectionIcon";
import PCIcon from "../../icons/PCIcon";
import LaptopIcon from "../../icons/LaptopIcon";
import SwitchIcon from "../../icons/SwitchIcon";
import ServerIcon from "../../icons/ServerIcon";
import FirewallIcon from "../../icons/FirewallIcon";
import GlobalNetworkIcon from "../../icons/GlobalNetworkIcon";

const icons = {
  pc: <PCIcon />,
  laptop: <LaptopIcon />,
  switch: <SwitchIcon />,
  server: <ServerIcon />,
  firewall: <FirewallIcon />,
  selection: <SelectionIcon />,
  globalnetwork: <GlobalNetworkIcon />,
};

export default function DiagramEditor() {
  const svgRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 1 });
  const [dragNodeId, setDragNodeId] = useState(null);
  const [startPoint, setStartPoint] = useState(null);
  const [linkStartNode, setLinkStartNode] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  // === Загрузка nodes и links из API ===
  useEffect(() => {
    const loadData = async () => {
      try {
        const [nodesRes, linksRes] = await Promise.all([
          API.fetchNodes(),
          API.fetchLinks(),
        ]);

        const nodesWithPosition = nodesRes.data.map((n) => ({
          id: n.id,
          type: n.type?.toLowerCase() ?? "pc",
          x: n.x ?? Math.random() * 500,
          y: n.y ?? Math.random() * 500,
        }));

        const linksFormatted = linksRes.data.map((l) => ({
          source: { id: l.source_id },
          target: { id: l.destination_id },
        }));

        setNodes(nodesWithPosition);
        setLinks(linksFormatted);
      } catch (err) {
        console.error("Ошибка при загрузке сети:", err);
      }
    };

    loadData();
  }, []);

  // === Навигация мышью ===
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") setStartPoint({ x: e.clientX, y: e.clientY, camera });
    };
    const handleKeyUp = () => setStartPoint(null);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [camera]);

  const screenToWorld = (x, y) => {
    const bounds = svgRef.current.getBoundingClientRect();
    return {
      x: (x - bounds.left - camera.x) / camera.zoom,
      y: (y - bounds.top - camera.y) / camera.zoom,
    };
  };

  const handleMouseDown = (e) => {
    if (!editMode) return;
    const pos = screenToWorld(e.clientX, e.clientY);
    if (startPoint) return;

    const hitNode = nodes.find(
      (n) =>
        pos.x >= n.x - 24 &&
        pos.x <= n.x + 24 &&
        pos.y >= n.y - 24 &&
        pos.y <= n.y + 24
    );

    if (hitNode) {
      if (e.shiftKey) {
        setLinkStartNode(hitNode);
      } else {
        setDragNodeId(hitNode.id);
        setSelectedNodeId(hitNode.id);
      }
    } else {
      setSelectedNodeId(null);
    }
  };

  const handleMouseMove = (e) => {
    if (startPoint) {
      const dx = e.clientX - startPoint.x;
      const dy = e.clientY - startPoint.y;
      setCamera({ ...camera, x: startPoint.camera.x + dx, y: startPoint.camera.y + dy });
    } else if (dragNodeId) {
      const pos = screenToWorld(e.clientX, e.clientY);
      setNodes((prev) => {
        const updated = prev.map((n) =>
          n.id === dragNodeId ? { ...n, x: pos.x, y: pos.y } : n
        );
        // Автосохранение позиции узла
        const updatedNode = updated.find((n) => n.id === dragNodeId);
        API.updateNode(dragNodeId, { x: updatedNode.x, y: updatedNode.y }).catch(console.error);
        return updated;
      });
    }
  };

  const handleMouseUp = (e) => {
    if (!editMode) return;
    const pos = screenToWorld(e.clientX, e.clientY);

    if (linkStartNode) {
      const targetNode = nodes.find(
        (n) =>
          pos.x >= n.x - 24 &&
          pos.x <= n.x + 24 &&
          pos.y >= n.y - 24 &&
          pos.y <= n.y + 24 &&
          n.id !== linkStartNode.id
      );
      if (targetNode) {
        const newLink = { source: { id: linkStartNode.id }, target: { id: targetNode.id } };
        setLinks((prev) => [...prev, newLink]);
        API.createLink({
          source_id: linkStartNode.id,
          destination_id: targetNode.id,
        }).catch(console.error);
      }
      setLinkStartNode(null);
    }
    setDragNodeId(null);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const svgBounds = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - svgBounds.left;
    const mouseY = e.clientY - svgBounds.top;

    setCamera((prev) => {
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const newZoom = Math.min(Math.max(prev.zoom + delta, 0.2), 5);
      const worldX = (mouseX - prev.x) / prev.zoom;
      const worldY = (mouseY - prev.y) / prev.zoom;
      const newCameraX = mouseX - worldX * newZoom;
      const newCameraY = mouseY - worldY * newZoom;

      return {
        x: newCameraX,
        y: newCameraY,
        zoom: newZoom,
      };
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("type");
    const pos = screenToWorld(e.clientX, e.clientY);
    const newNode = { id: nanoid(), x: pos.x, y: pos.y, type };
    setNodes([...nodes, newNode]);
    API.createNode(newNode).catch(console.error);
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  return (
    <div style={{ display: "flex", alignItems: "stretch", flexDirection: "row", height: "100%", width: "100%", userSelect: "none", position: "relative" }}>
      {editMode && (
        <div style={{ width: "7%", height: "92.4%", background: "#eee", padding: 4 }}>
          {Object.entries(icons).map(([key, icon]) => (
            <div
              key={key}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("type", key)}
              style={{ marginBottom: 10 }}
            >
              {icon}
            </div>
          ))}
        </div>
      )}
      <button
        onClick={() => setEditMode(!editMode)}
        style={{ position: "absolute", top: 10, right: 10, zIndex: 1 }}
      >
        {editMode ? "Выход из редактирования" : "Редактировать"}
      </button>
      <div style={{ height: "93.3%", width: "100%" }}>
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          style={{ border: "1px solid #ccc", background: "#f9f9f9" }}
        >
          <g transform={`translate(${camera.x}, ${camera.y}) scale(${camera.zoom})`}>
            {links.map((l, i) => {
              const source = nodes.find((n) => n.id === l.source.id);
              const target = nodes.find((n) => n.id === l.target.id);
              if (!source || !target) return null;
              return (
                <line
                  key={i}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke="#999"
                  strokeWidth={2}
                />
              );
            })}
            {nodes.map((n) => (
              <g
                key={n.id}
                transform={`translate(${n.x}, ${n.y})`}
                style={{ cursor: editMode ? "pointer" : "default" }}
              >
                <g transform="translate(-16, -16) scale(1.5)">
                  {icons[n.type] || icons.pc}
                </g>
              </g>
            ))}
          </g>
        </svg>
        {selectedNode && (
          <div
            style={{
              width: "30vw",
              background: "#fff",
              borderLeft: "1px solid #ccc",
              padding: "1rem",
              position: "absolute",
              top: 0,
              right: 0,
              height: "100%",
              zIndex: 2,
              boxShadow: "-2px 0 5px rgba(0,0,0,0.1)",
            }}
          >
            <h3>Настройки узла</h3>
            <p>ID: {selectedNode.id}</p>
            <p>Тип: {selectedNode.type}</p>
            {/* Расширь форму если нужно */}
          </div>
        )}
      </div>
    </div>
  );
}
