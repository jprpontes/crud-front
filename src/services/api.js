import axios from "axios";

const api = axios.create({
  baseURL: "https://shipsmart-crud.test/api/",
});

export default api;
