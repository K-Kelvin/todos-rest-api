const express = require("express");
const bodyParser = require("body-parser");
// connect to the database
require("./database");
const Todo = require("./models/Todo");

const app = express();
const PORT = 3030;

// defines a middleware that accepts json from users and adds
// the parsed result to 'req.body'
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.json({ message: "Success!", routes: ["/todos", "/todos/:todoId"] });
});

app.route("/todos")
    .get(async (req, res) => {
        const todos = await Todo.findAll();
        res.json(todos);
    })
    .post(async (req, res) => {
        const { title } = req.body;
        // save Todo on the database
        const todo = await Todo.create({ title, isComplete: false });

        res.status(201).json(todo); // status 201 -> Created
    });
app.route("/todos/:todoId(\\d+)")
    .get(async (req, res) => {
        const todoId = req.params.todoId;
        // find and return a single todo
        const todo = await Todo.findByPk(todoId);

        if (!todo) {
            return res.status(404).json({ message: "Todo not found!" }); // status 404 -> Not Found
        }

        res.json(todo);
    })
    .patch(async (req, res) => {
        const todoId = req.params.todoId;
        const { title, isComplete } = req.body;

        // perform a partial update to the todo
        const [noOfRowsUpdated] = await Todo.update(
            { title, isComplete },
            { where: { id: todoId } }
        );

        if (noOfRowsUpdated < 1) {
            return res.status(400).json({ message: "Failed to update!" }); // status 400 -> Bad Request
        }

        const todo = await Todo.findByPk(todoId);

        res.status(200).json(todo);
    })
    .delete(async (req, res) => {
        const todoId = req.params.todoId;

        // SQL: DELETE * FROM public.todos WHERE id=todoId;
        const noOfRowsDeleted = await Todo.destroy({ where: { id: todoId } });

        if (noOfRowsDeleted < 1) {
            return res.status(400).json({ message: "Failed to delete!" }); // status 400 -> Bad Request
        }

        res.status(204); // status 204 -> No Content (Deleted)
    });

app.listen(PORT, () => {
    console.log(`REST API Server running on http://localhost:${PORT}`);
});
