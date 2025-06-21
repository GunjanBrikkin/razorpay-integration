const mongoose = require("mongoose");
const {DB_URL} = require("../config/env")

module.exports.connect = async () => {
    try{
        await mongoose.connect(DB_URL);
        console.log("Database Connected");
        return true;
    }catch(error){
         console.log(
            "================= Error To Connect with database ================= ",error
        );
        return false;
    }
}