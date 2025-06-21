const UserModel = require("../models/user.model");

const userService = {
  createUser: async (formdata) => {
    const { number } = formdata;

    // ✅ Check if number already exists
    const existingUser = await UserModel.findOne({ number });

    if (existingUser) {
      return { exists: true }; // signal to controller
    }

    const newUser = await UserModel.create(formdata);
    return { exists: false, user: newUser };
  },

   getAllUsers: async () => {
    return await UserModel.find({});
  },

  updateUserById: async (updates) => {
    return await UserModel.findByIdAndUpdate(updates._id, updates, { new: true });
  },

  isUserExisted: async (user_id) => {
    return await UserModel.findById(user_id);
  }

};

module.exports = userService;
