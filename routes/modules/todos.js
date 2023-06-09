const express = require("express");
const router = express.Router();
const Todo = require("../../models/todo");
router.get("/new", (req, res) => {
  return res.render("new");
});
router.get("/:id", (req, res) => {
  const id = req.params.id;

  return Todo.findById(id)
    .lean()
    .then((todo) => res.render("detail", { todo }))
    .catch((error) => console.log(error));
});
router.get("/:id/edit", (req, res) => {
  const id = req.params.id;

  return Todo.findById(id)
    .lean()
    .then((todo) => res.render("edit", { todo }))
    .catch((error) => console.log(error));
});

router.post("/", (req, res) => {
  const name = req.body.name;
  const todo = new Todo({
    name,
  });
  return todo
    .save()
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const { name, isDone } = req.body;
  return Todo.findById(id)
    .then((todo) => {
      todo.name = name;
      if (isDone) {
        todo.isDone = true;
      } else {
        todo.isDone = false;
      }
      return todo.save();
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch((error) => console.log(error));
});
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  return Todo.findById(id)
    .then((todo) => todo.deleteOne()) //remove()在mongoose5.0以後不支援了
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});
module.exports = router;
