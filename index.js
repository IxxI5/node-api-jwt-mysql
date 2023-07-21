/* access to config.json file */
const config = require(__dirname + "/config/config.json")["development"]; // "development" key from config.json

/* library to access mysql database from Node.js */
const mysql = require("mysql2/promise");

/* library to add colors to console output */
const colors = require("colors");

/* web framework for Node.js */
const express = require("express");

/* creates an Express application */
const app = express();

/* library that provides Cross-origin resource sharing (means outside the domain from which the web api is being served) */
const cors = require("cors");

/* library to hash passwords */
const bcrypt = require("bcrypt");

/* carries the sequelized models as exported from sequelize/index.js */
const db = require("./sequelize");

/* destructuring to user and car sequelized objects as exported from sequelize/index.js */
const { user, car } = require("./sequelize");

/* parses cookie header or may create cookie with httpOnly (inaccessible to client-side scripts) */
const cookieParser = require("cookie-parser");

/* creates, validates and decodes a token e.g. hosted in a protected cookie (httpOnly) */
const { createTokens, validateToken, decodeToken } = require("./jwt");

/* middleware => only parses json */
app.use(express.json());

/* middleware => cors */
app.use(cors());

/* middleware => parses cookies => that are sent to client with a server request and stored on the client side */
app.use(cookieParser());

/* POST register (new user) => adds a new user to the database */
app.post("/register", async (req, res) => {
  const { username, password } = req.body; // request data from body (send by the client)

  /* hashes (obscures/not readable in database) and then creates a user in database with the hashed password */
  await bcrypt.hash(password, 10).then((hash) => {
    user
      .create({
        username: username,
        password: hash,
      })
      .then(() => {
        res.json("USER REGISTERED");
      })
      .catch((err) => {
        if (err) {
          res.status(400).json({ error: err });
        }
      });
  });
});

/* POST login (existing user) */
app.post("/login", async (req, res) => {
  const { username, password } = req.body; // request data from body (send by the client)
  const userObj = await user.findOne({ where: { username: username } }); // find the user in database having the given username

  if (!userObj) {
    res.status(400).json({ error: "User Doesn't Exist" });

    return;
  }

  const dbPassword = userObj.password; // extract the password from the found user

  /* while logging in, the unhashed entered password is hashed and compared with all those in database (if any)  */
  await bcrypt.compare(password, dbPassword).then((match) => {
    if (!match) {
      res
        .status(400)
        .json({ error: "Wrong Username and Password Combination!" });
    } else {
      const accessToken = createTokens(userObj);

      res.cookie("access-token", accessToken, {
        maxAge: 60 * 60 * 3 * 1 * 1000, // expires after 3 * 60 min
        httpOnly: true,
      });

      res.json("LOGGED IN");
    }
  });
});

/* POST logout (loggedin user) by creating a new httpOnly Cookie that expires immediately */
app.post("/logout", validateToken, async (req, res) => {
  const userObj = decodeToken(req); // retrieves the current user from existing httpOnly cookie
  const accessToken = createTokens(userObj); // creates a new token for the currently loggedin user that expires immediatelly on response (see below)

  res.cookie("access-token", accessToken, {
    maxAge: -1, // expires immediatelly
    httpOnly: true,
  });

  res.json("LOGGED OUT");
});

/* POST cars (loggedin user) => adds a new car to the database */
app.post("/cars", validateToken, async (req, res) => {
  const user = decodeToken(req);
  const { model, purchaseDate } = req.body; // request data from body (send by the client)

  await car
    .create({
      model: model,
      purchaseDate: purchaseDate,
      userId: user.id,
    })
    .then(() => {
      res.json({
        message: "car created",
        model: model,
        purchaseDate: purchaseDate,
      });
    })
    .catch((err) => {
      if (err) {
        res.status(400).json({ error: err });
      }
    });
});

/* DELETE cars (loggedin user) => deletes the car with the specified id from database */
app.delete("/cars/:id", validateToken, async (req, res) => {
  const carId = req.params.id;
  const user = decodeToken(req);
  const carObj = await car.findOne({
    where: {
      userId: user.id,
      id: carId,
    },
  });

  if (carObj === null) {
    res.json({
      message: "car not found",
    });

    return;
  }

  await car.destroy({
    where: {
      userId: user.id,
      id: carId,
    },
  });

  res.json({
    message: "car deleted",
  });
});

/* GET cars (loggedin user) => retrieves the cars of the loggedin user */
app.get("/cars", validateToken, async (req, res) => {
  const user = decodeToken(req);

  const cars = await car.findAll({
    where: { userId: user.id },
  });
  res.json({ cars: cars });
});

/* GET user (existing user) => retrieves the user details of the loggedin user */
app.get("/user", validateToken, (req, res) => {
  const user = decodeToken(req);

  res.json({ username: user.username, id: user.id });
});

/* initialize MySQL database */
async function initialize(sync) {
  const { host, port, user, password } = config;
  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password,
  });

  /* CREATE database if not exists */
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${config.database}\`;`
  );

  console.log("Database created");

  sync();
}

/* initialize (CREATE database if not exists) and then execute the sync function */
initialize(sync);

/* start the connection to MySQL server and then listen to user requests */
function sync() {
  db.sequelize
    .sync() // sync with the database (automatically create tables from models if not available)
    .then(() => {
      console.log("MySQL SERVER IS RUNNING...".bgBlue);

      // on successful connection with the database, listen (web api) to user requests
      app.listen(3001, () => {
        console.log("API SERVER ON PORT 3001 IS RUNNING...".bgCyan);
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

/* Node WEB API Endpoints
   e.g. http://localhost:3001/cars

  POST:   /register
  POST:   /login
  POST:   /logout
  POST:   /cars
  DELETE: /cars/:id
  GET:    /cars
  GET:    /user
    
*/
