import axios from "axios";

const api = axios.create({
  baseURL: "http://201.23.64.218:8000/",
  timeout: 10000,
});

export default api;