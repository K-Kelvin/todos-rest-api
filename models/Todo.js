const sequelize = require("../database");
const { DataTypes } = require("sequelize");

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

module.exports = Todo;
