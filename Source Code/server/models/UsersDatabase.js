require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", err => console.err(err));
db.once("open", () => console.log(`Connected to users database`));

const usersSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: String,
  email: String,
  role: String,
  phone_number: String
});

module.exports = mongoose.model("users", usersSchema);
