const mongoose = require('mongoose');
// const uri = "mongodb+srv://camilovelez4_db_user:WlxMvDprNmcGihxH@clustervz.7qcgdxb.mongodb.net/?retryWrites=true&w=majority&appName=ClusterVz";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
const config = require("./config");

const connectDB = async () => {
    try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(config.databaseURI,clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
   } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

module.exports = connectDB;