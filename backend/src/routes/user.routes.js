const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const {createUserValidator,updateUserValidation} = require("../validations/user.validation");


// POST /api/users
router.post("/create",createUserValidator, userController.createUser);
router.post("/update", updateUserValidation ,userController.updateUser);
router.post("/list", userController.listUsers);

module.exports = router;
