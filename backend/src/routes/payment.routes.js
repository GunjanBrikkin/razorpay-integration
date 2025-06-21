const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const {rezorpayValidation} = require("../validations/razorpayvalidation");

router.post("/create-order", rezorpayValidation , paymentController.createOrder);

module.exports = router;
