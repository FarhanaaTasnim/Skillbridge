const raw = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_URL = raw.endsWith("/") ? raw.slice(0, -1) : raw;

export default API_URL;