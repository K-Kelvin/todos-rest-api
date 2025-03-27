const sequelize = require("../database");
const { DataTypes } = require("sequelize");
// const User = require("./User");

const Todo = sequelize.define("Todo", {
    title: DataTypes.STRING,
    isComplete: DataTypes.BOOLEAN,
});

Todo.sync()
    .then(() => {
        console.log("Todo table connected successfully!");
    })
    .catch((err) => {
        console.log("Failed to connect to the Todo table: ", err);
    });

// One user can create many todos, but a single instance of a todo can only belong to one user
// User:Todo => One to Many
// Todo.belongsTo(User, { onDelete: "CASCADE" });

module.exports = Todo;
