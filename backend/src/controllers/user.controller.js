const userService = require("../services/user.service");
const {GetApiResponse} = require("../utils/apiResponse");
const {validationResult} = require("express-validator");

const userController = {
  createUser: async (req, res) => {
    try {
      const formdata = req.body;
        console.log("req",req)
     const errors = validationResult(req);
     let isValidData;
     console.log('errors',errors)

     if(!errors.isEmpty()){
        isValidData =  GetApiResponse(
                        errors.array(),
                        "Please fill all required field to continue",
                        "false"
                    );
                    return res.status(400).json(isValidData);
     }

      const result = await userService.createUser(formdata);

      if (result.exists) {
        return res.status(409).json({
          success: false,
          message: "Number already exists",
          data: []
        });
      }

      res.status(201).json({
        success: true,
        message: "User created",
        data: [result.user],
      });

    } catch (error) {
      console.error("Error in userController:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error"
      });
    }
  },

  updateUser: async (req, res) => {
  try {
   
    const updates = req.body;

    const errors = validationResult(req);
    let isValidData,isOneField;

    if(!errors.isEmpty()){
        isValidData =  GetApiResponse(
                        errors.array(),
                        "Please fill all required field to continue",
                        "false"
                    );
                    return res.status(400).json(isValidData);
    }

    if (Object.keys(updates).length === 1) {
                        isOneField = await GetApiResponse(
                            [],
                            "Please provide at least one field to update",
                            "204"
                        );
                         return res.status(400).json(isOneField);
                    }

    const updatedUser = await userService.updateUserById(updates);
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: []
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: [updatedUser]
    });

  } catch (error) {
    console.error("Error in updateUser:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
},

listUsers: async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({
      success: true,
      message: "User list fetched successfully",
      data: users
    });
  } catch (error) {
    console.error("Error in listUsers:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
},


};

module.exports = userController;
