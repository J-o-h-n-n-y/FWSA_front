import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // Убедись, что порт и адрес совпадают
});

// NETWORKS
export const fetchNetworks = () => api.get("/networks");
export const createNetwork = (data) => api.post("/networks", data);
export const updateNetwork = (id, data) => api.put(`/networks/${id}`, data);
export const deleteNetwork = (id) => api.delete(`/networks/${id}`);

// GROUPS
export const fetchGroups = () => api.get("/groups");
export const createGroup = (data) => api.post("/groups", data);
export const updateGroup = (id, data) => api.put(`/groups/${id}`, data);
export const deleteGroup = (id) => api.delete(`/groups/${id}`);

// NODES
export const fetchNodes = () => api.get("/nodes");
export const createNode = (data) => api.post("/nodes", data);
export const updateNode = (id, data) => api.put(`/nodes/${id}`, data);
export const deleteNode = (id) => api.delete(`/nodes/${id}`);

// INTERFACES
export const fetchInterfaces = () => api.get("/interfaces");
export const createInterface = (data) => api.post("/interfaces", data);
export const updateInterface = (id, data) => api.put(`/interfaces/${id}`, data);
export const deleteInterface = (id) => api.delete(`/interfaces/${id}`);

// LINKS
export const fetchLinks = () => api.get("/links");
export const createLink = (data) => api.post("/links", data);
export const updateLink = (source_id, destination_id, data) =>
  api.put(`/links?source_id=${source_id}&destination_id=${destination_id}`, data);
export const deleteLink = (source_id, destination_id) =>
  api.delete(`/links?source_id=${source_id}&destination_id=${destination_id}`);

// MESSAGES
export const fetchMessages = () => api.get("/messages");
export const createMessage = (data) => api.post("/messages", data);
export const updateMessage = (id, data) => api.put(`/messages/${id}`, data);
export const deleteMessage = (id) => api.delete(`/messages/${id}`);
