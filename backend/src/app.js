const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const paymentRoutes = require("./routes/payment.routes");

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/users",userRoutes);
app.use("/api/payment", paymentRoutes);

module.exports = app;

