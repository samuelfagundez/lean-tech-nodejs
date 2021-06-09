// Database connection middleware

const mongoose = require("mongoose");
const dbConnection = async () => {
  try {
    await mongoose.connect(
      process.env.DB_CNN || "mongodb://localhost:27017/orders",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }
    );

    console.log("DB Online");
  } catch (error) {
    throw new Error("Database error");
  }
};

module.exports = {
  dbConnection
};
