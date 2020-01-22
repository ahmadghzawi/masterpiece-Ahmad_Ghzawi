require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", error => console.err(error));
db.once("open", () => console.log(`Connected to Posts database`));

const productsSchema = new mongoose.Schema(
  {
    seller_id: { type: String, required: true },
    title: { type: String, required: true },
    location: { type: String, required: true },
    product_category: { type: String, required: true },
    info: String,
    image_path: { type: String, required: true },
    bid: { type: Number, required: true }
  },
  { strict: false }
);

module.exports = mongoose.model("products", productsSchema);
