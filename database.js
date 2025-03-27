const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "database.sqlite",
    logging: false,
});

async function loadDatabase() {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully!");
    } catch (error) {
        console.log("Unable to connect to the database!");
    }
}

loadDatabase();

module.exports = sequelize;
