const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const app = express();
app.engine("hbs", exphbs.engine({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", "hbs");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
app.get("/", (req, res) => {
  res.render("index");
});
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", () => {
  console.log("mongodb error!");
});
db.once("open", () => {
  console.log("mongodb connected!");
});
app.get("/", (req, res) => {
  res.send("hello world!");
});
app.listen(3000, () => {
  console.log("running running running~");
});
