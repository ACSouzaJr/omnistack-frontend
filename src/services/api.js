import axios from "axios";

const api = axios.create({
  baseURL: "https://omniatack-backend-33.herokuapp.com"
});

export default api;
