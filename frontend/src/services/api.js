import axios from "axios";

const api = axios.create({
  baseURL: "https://razorpay-integration-1-ogch.onrender.com"
});

export default api;
