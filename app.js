const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const Todo = require("./models/todo");
const app = express();
app.engine("hbs", exphbs.engine({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", "hbs");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
app.get("/", (req, res) => {
  Todo.find() // 取出 Todo model 裡的所有資料
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .then((todos) => res.render("index", { todos })) // 將資料傳給 index 樣板
    .catch((error) => console.error(error));
});
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/todos/new", (req, res) => {
  return res.render("new");
});
app.get("/todos/:id", (req, res) => {
  const id = req.params.id;

  return Todo.findById(id)
    .lean()
    .then((todo) => res.render("detail", { todo }))
    .catch((error) => console.log(error));
});
app.get("/todos/:id/edit", (req, res) => {
  const id = req.params.id;

  return Todo.findById(id)
    .lean()
    .then((todo) => res.render("edit", { todo }))
    .catch((error) => console.log(error));
});
app.post("/todos", (req, res) => {
  const name = req.body.name;
  const todo = new Todo({
    name,
  });
  return todo
    .save()
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});
app.post("/todos/:id/edit", (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  return Todo.findById(id)
    .then((todo) => {
      todo.name = name;
      return todo.save();
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch((error) => console.log(error));
});
app.post("/todos/:id/delete", (req, res) => {
  const id = req.params.id;
  return Todo.findById(id)
    .then((todo) => todo.deleteOne()) //remove()在mongoose5.0以後不支援了
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(3000, () => {
  console.log("running running running~");
});
