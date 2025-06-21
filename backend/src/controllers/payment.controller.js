const razorpay = require("../config/razorpay");
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
                isValidData =  GetApiResponse(
                                errors.array(),
                                "Please fill all required field to continue",
                                "false"
                            );
                            return res.status(400).json(isValidData);
             }
     
      const { amount, currency = "INR", receipt , user_id } = req.body;

      const isUserExisted = await userService.isUserExisted(user_id);

     if(isUserExisted == null){
       return res.status(400).json({
        success: false,
        message: "User not found,Please check the user_id",
        data: [],
      });
     }

      const options = {
        amount: amount, // Razorpay accepts amount in paise
        currency,
        receipt,
        payment_capture: 1,
      };

      const order = await razorpay.orders.create(options);

      req.body.payment_amount = amount;
      req.body.payment_Status = "Done";
      req.body._id = user_id;

      const updateUser = await userService.updateUserById(req.body);

      res.status(200).json({
        success: true,
        message: "Payment created successfully",
        data: order
      });
    } catch (error) {
      console.error("Error in createOrder:", error);
      res.status(500).json({
        success: false,
        message: "Unable to create Razorpay order"
      });
    }
  }
};

module.exports = paymentController;
