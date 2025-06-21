const {body} = require("express-validator");

const rezorpayValidation = [
   body("amount")
     .notEmpty()
     .withMessage("Please enter the amount")
     .isFloat({ min: 0 })
     .withMessage("Amount must be a positive number"),

    body("user_id")
      .notEmpty()
      .withMessage("Please pass the user_id")
      .isMongoId()
      .withMessage("Please provide a proper mongodb id")
];

module.exports = {
    rezorpayValidation
}