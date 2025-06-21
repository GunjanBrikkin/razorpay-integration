const {body} = require("express-validator");

const createUserValidator = [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Please provide a valid email"),
    body("number")
        .notEmpty().withMessage("number is required")
        .matches(/^\d+$/).withMessage("number must be digits only without spaces")
        .isLength({ min: 10, max: 10 }).withMessage("number must be 10 digits long")
];

const updateUserValidation = [
    body("_id")
    .notEmpty()
    .withMessage("Please pass the _id")
    .isMongoId()
    .withMessage("Please provide a proper mongodb id")
];

module.exports = {
    createUserValidator,
    updateUserValidation
}