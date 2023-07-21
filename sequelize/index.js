"use strict";

/* library to access the file system */
const fs = require("fs");

/* library with helpful methods for directory paths and filenames */
const path = require("path");

/* library for Node.js ORM that applies to Oracle, Postgres, MySQL, MariaDB, SQLite and SQL Server, and more. */
const Sequelize = require("sequelize");

/* access to config.json file */
const config = require(__dirname + "/../config/config.json")["development"]; // "development" key from config.json

/* models path */
const models = path.join(__dirname, "models");

/* holds the relations (associations) between the models */
const { associations } = require("./associations");

const db = {};

/* instantiate sequelize with name of database, username and password */
const sequelize = new Sequelize(
  config.database,
  config.user,
  config.password,
  config
);

/* sequelize/import all model files being under models folder */
fs.readdirSync(models).forEach((file) => {
  const model = require(path.join(models, file))(sequelize, Sequelize);

  db[model.name] = model;
});

/* apply the associations (relations e.g. hasMany, belongsTo, etc.) between the models => called always after models sequelize/import  */
associations(sequelize);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
