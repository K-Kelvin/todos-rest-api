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

app.listen(PORT, () => {
    console.log(`REST API Server running on http://localhost:${PORT}`);
});
