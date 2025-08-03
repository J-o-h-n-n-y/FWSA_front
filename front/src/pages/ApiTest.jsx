import React, { useState, useEffect } from "react";
import * as API from "../API";

const ApiTester = () => {
  const [log, setLog] = useState([]);

  const appendLog = (msg) => setLog((prev) => [...prev, msg]);

  const runTests = async () => {
    try {
      // NETWORK
      const net = await API.createNetwork({ name: "TestNet" });
      appendLog(`Created Network: ${net.data.id}`);
      await API.updateNetwork(net.data.id, { name: "UpdatedNet" });
      appendLog(`Updated Network: ${net.data.id}`);
      const nets = await API.fetchNetworks();
      appendLog(`Fetched Networks: ${nets.data.length}`);
      await API.deleteNetwork(net.data.id);
      appendLog(`Deleted Network: ${net.data.id}`);

      // GROUP
      const net2 = await API.createNetwork({ name: "NetWithGroup" });
      const group = await API.createGroup({ network_id: net2.data.id });
      appendLog(`Created Group: ${group.data.id}`);
      await API.updateGroup(group.data.id, { network_id: net2.data.id });
      appendLog(`Updated Group: ${group.data.id}`);
      const groups = await API.fetchGroups();
      appendLog(`Fetched Groups: ${groups.data.length}`);
      await API.deleteGroup(group.data.id);
      appendLog(`Deleted Group: ${group.data.id}`);
      await API.deleteNetwork(net2.data.id);

      // NODE
      const net3 = await API.createNetwork({ name: "NetWithNode" });
      const node = await API.createNode({ type: "Router", network_id: net3.data.id });
      appendLog(`Created Node: ${node.data.id}`);
      await API.updateNode(node.data.id, { type: "Switch" });
      appendLog(`Updated Node: ${node.data.id}`);
      const nodes = await API.fetchNodes();
      appendLog(`Fetched Nodes: ${nodes.data.length}`);
      await API.deleteNode(node.data.id);
      appendLog(`Deleted Node: ${node.data.id}`);
      await API.deleteNetwork(net3.data.id);

      // INTERFACE
      const net4 = await API.createNetwork({ name: "NetWithInterface" });
      const node2 = await API.createNode({ type: "Host", network_id: net4.data.id });
      const intf = await API.createInterface({ node_id: node2.data.id, ip: "192.168.0.1" });
      appendLog(`Created Interface: ${intf.data.id}`);
      await API.updateInterface(intf.data.id, { ip: "10.0.0.1" });
      appendLog(`Updated Interface: ${intf.data.id}`);
      const interfaces = await API.fetchInterfaces();
      appendLog(`Fetched Interfaces: ${interfaces.data.length}`);
      await API.deleteInterface(intf.data.id);
      appendLog(`Deleted Interface: ${intf.data.id}`);
      await API.deleteNode(node2.data.id);
      await API.deleteNetwork(net4.data.id);

      // LINK
      const net5 = await API.createNetwork({ name: "NetWithLink" });
      const nodeA = await API.createNode({ type: "A", network_id: net5.data.id });
      const nodeB = await API.createNode({ type: "B", network_id: net5.data.id });
      await API.createLink({ source_id: nodeA.data.id, destination_id: nodeB.data.id, network_id: net5.data.id });
      appendLog(`Created Link A->B`);
      await API.updateLink(nodeA.data.id, nodeB.data.id, { description: "A to B link" });
      appendLog(`Updated Link A->B`);
      const links = await API.fetchLinks();
      appendLog(`Fetched Links: ${links.data.length}`);
      await API.deleteLink(nodeA.data.id, nodeB.data.id);
      appendLog(`Deleted Link A->B`);
      await API.deleteNode(nodeA.data.id);
      await API.deleteNode(nodeB.data.id);
      await API.deleteNetwork(net5.data.id);

      // MESSAGE
      const net6 = await API.createNetwork({ name: "NetWithMsg" });
      const nodeM = await API.createNode({ type: "M", network_id: net6.data.id });
      const msg = await API.createMessage({
        date: new Date().toISOString(),
        source_id: nodeM.data.id,
        type: "INFO",
        message: "Hello World"
      });
      appendLog(`Created Message: ${msg.data.id}`);
      await API.updateMessage(msg.data.id, { message: "Updated message" });
      appendLog(`Updated Message: ${msg.data.id}`);
      const messages = await API.fetchMessages();
      appendLog(`Fetched Messages: ${messages.data.length}`);
      await API.deleteMessage(msg.data.id);
      appendLog(`Deleted Message: ${msg.data.id}`);
      await API.deleteNode(nodeM.data.id);
      await API.deleteNetwork(net6.data.id);

    } catch (err) {
      console.error(err);
      appendLog("❌ Error occurred. Check console.");
    }
  };

  return (
    <div className="p-4">
      <button onClick={runTests} className="bg-blue-600 text-white px-4 py-2 rounded shadow">
        Запустить все API-тесты
      </button>
      <div className="mt-4 bg-gray-100 p-4 rounded h-[300px] overflow-auto">
        <h3 className="font-bold mb-2">Лог:</h3>
        <ul className="list-disc list-inside text-sm space-y-1">
          {log.map((entry, idx) => (
            <li key={idx}>{entry}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ApiTester;
