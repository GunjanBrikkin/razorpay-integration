import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Payment from "../pages/Payment";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/payment" element={<Payment />} />
  </Routes>
);

export default AppRoutes;
