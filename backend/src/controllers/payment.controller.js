const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const {validationResult} = require("express-validator");
const {GetApiResponse} = require("../utils/apiResponse");
const userService = require("../services/user.service");

const paymentController = {
  createOrder: async (req, res) => {
    try {
      const errors = validationResult(req);
      let isValidData;

      if(!errors.isEmpty()){
        console.log("ko")
        isValidData = GetApiResponse(
          errors.array(),
          "Please fill all required field to continue",
          "false"
        );
        return res.status(400).json(isValidData);
      }
     
      const { amount, currency = "INR", receipt, user_id } = req.body;
      console.log("req.body.amount",req.body.amount)

      const isUserExisted = await userService.isUserExisted(user_id);

      console.log("isUserExisted",isUserExisted)

      if(isUserExisted == null){
        return res.status(400).json({
          success: false,
          message: "User not found,Please check the user_id",
          data: [],
        });
      }

      const options = {
        amount: amount, // Amount is already in paise from frontend
        currency,
        receipt: receipt || `receipt_${Date.now()}`,
        payment_capture: 1,
      };

      console.log("options",options)

      const order = await razorpay.orders.create(options);

      // DON'T update payment status here - only create the order
      // Status should remain "pending" until payment is verified

      res.status(200).json({
        success: true,
        message: "Order created successfully",
        data: order
      });
    } catch (error) {
      console.error("Error in createOrder:", error);
      res.status(500).json({
        success: false,
        message: "Unable to create Razorpay order"
      });
    }
  },

verifyPayment: async (req, res) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    user_id,
    amount
  } = req.body;

  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !user_id || !amount) {
    return res.status(400).json({
      success: false,
      message: "Missing required payment fields"
    });
  }

  try {
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET) // ← Ensure this matches your `.env`
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await userService.updateUserById({
        _id: user_id,
        payment_amount: amount,
        payment_Status: "Cancelled"
      });

      return res.status(400).json({
        success: false,
        message: "Payment verification failed"
      });
    }

    // Signature matched
    await userService.updateUserById({
      _id: user_id,
      payment_amount: amount,
      payment_Status: "Done",
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified and completed successfully",
      data: {
        status: "Done",
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        amount: amount
      }
    });

  } catch (error) {
    console.error("Error in verifyPayment:", error);

    if (user_id && amount) {
      try {
        await userService.updateUserById({
          _id: user_id,
          payment_amount: amount,
          payment_Status: "Cancelled"
        });
      } catch (updateError) {
        console.error("Error updating payment status:", updateError);
      }
    }

    return res.status(500).json({
      success: false,
      message: "Payment verification failed"
    });
  }
}

};

module.exports = paymentController;