const http = require("http");
const connectionToDB = require("./src/config/database");
const {PORT} = require("./src/config/env");
const app = require("./src/app");

const startServer = async () => {
    try{
        
        const server = http.createServer(app);

        await connectionToDB.connect();

        server.listen(PORT,()=>{
            console.log(`Server is running on port ${PORT}`);
        })


    }catch(error){
        console.log("Failed to start server : ", error);
        process.exit(1);
    }
} 

startServer();