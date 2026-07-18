import axios from "axios";

const railradar = axios.create({
  baseURL: "https://api.railradar.in/v1",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_RAILRADAR_API_KEY}`,
  },
});

export default railradar;
