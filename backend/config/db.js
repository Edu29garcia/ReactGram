const mongoose = require("mongoose");
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

const conn = async () => {
  try {
    const dbConn = await mongoose.connect(
      `mongodb+srv://${dbUser}:${dbPassword}@reactdb.yrrwz.mongodb.net/?retryWrites=true&w=majority&appName=reactDB`
    );

    console.log("Conectou ao banco de dados");

    return dbConn;
  } catch (error) {
    console.log(error);
  }
};

conn();

module.exports = conn;