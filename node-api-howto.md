## NodeJS Web API

Author: IxxI5

**Dependencies**

```javascript
/*{
"bcrypt": "^5.1.0",
"colors": "^1.4.0",
"cookie-parser": "^1.4.6",
"cors": "^2.8.5",
"express": "^4.18.2",
"jsonwebtoken": "^8.5.1",
"mysql2": "^2.3.3",
"nodemon": "^2.0.22",
"sequelize": "^6.32.1",
"sequelize-cli": "^6.6.1"
}*/
```

_This document describes the steps of developing a simple Web API in NodeJS from scratch demonstrating the following_:

&check;**car.js, user.js**: Creating two simple models using Sequelize

&check;**associations.js**: Declaring the relation between the two models using Sequelize

&check; **sequelize/index.js**: Sequelizing all models provided by seperate files plus applying associations

&check; **jwt.js**: Creating, validating and decoding JWT Tokens stored in an httpOnly Cookie

&check; **index.js**:

- **Creating a MySQL database**

- **/register** [POST]: new users into the database

- **/login** [POST]: user

- **/logout** [POST]: loggedin user

- **/cars** [POST]: create a new car entry into the database

- **/cars/:id** [DELETE]: delete a car with a given id

- **/cars** [GET]: retrieve all cars associated with the loggedin user

- **/user** [GET]: retrieve the currently loggedin user

## Table of Contents

- [Step 1 - Install the VS Code Non-Mandatory Plugins](#step-1---install-the-vs-code-non-mandatory-plugins)
- [Step 2 - Install the MySQL Community Server](#step-2---install-the-mysql-community-server)
- [Step 3 - Create the Project Structure](#step-3---create-the-project-structure)
- [Step 4 - Install the Packages (dependencies)](#step-4---install-the-packages-dependencies)
- [Step 5 - Define the Connection Configuration to MySQL Server](#step-5---define-the-connection-configuration-to-mysql-server)
- [Step 6 - Define the Models (using Sequelize)](#step-6---define-the-models-using-sequelize)
- [Step 7 - Define the Models Associations](#step-7---define-the-models-associations)
- [Step 8 - Sequelize the Models](#step-8---sequelize-the-models)
- [Step 9 - JWT Authentication](#step-9---jwt-authentication)
- [Step 10 - Define the Web API Endpoints](#step-10---define-the-web-api-endpoints)
- [Step 11 - Create the Database](#step-11---create-the-database)
- [Step 12 - Start the Web API](#step-12---start-the-web-api)

### [**Step 1 - Install the VS Code Non-Mandatory Plugins**](#table-of-contents)

- **Thunder Client**: A a lightweight Rest API Client Extension for Visual Studio Code
- **MySQL**: MySQL Management Tool

### [**Step 2 - Install the MySQL Community Server**](#table-of-contents)

- **Download and Install**: https://dev.mysql.com/downloads/mysql/
- **MySQL Installer**: Reconfigure &rarr; Authentication Method &rarr; "Use Legacy Authentication Method". Otherwise, the MySQL VS Code Plugin cannot connect to MySQL Server

**Connect to MySQL Server**

- Open MySQL Workbench
- Create a Connection named **node-api** and set:

  ```
  User: root

  Password: password
  ```

  Then press connect.

  **Note**: In case you want to use other values, make sure to update the config/config.js accordingly

### [**Step 3 - Create the Project Structure**](#table-of-contents)

**VS Code Command Prompt Terminal**

```
mkdir api

cd api

mkdir config

mkdir sequelize

mkdir sequelize\models

type nul > config/config.json

type nul > sequelize/models/car.js

type nul > sequelize/models/user.js

type nul > sequelize/associations.js

type nul > sequelize/index.js

type nul > index.js

type nul > jwt.js

npm init -y
```

**Resulted Project Structure**

```
api
  │
  ├── config
  ├── sequelize
  ├── index.js
  ├── jwt.js
  └── package.json
```

**Modify the created package.json** as follow:

```javascript
{
  "name": "node-web-api",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "scripts": {
    "start": "nodemon index.js"
  },
}
```

### [**Step 4 - Install the Packages (dependencies)**](#table-of-contents)

**VS Code Command Prompt Terminal**

```
npm install
```

**Resulted package.json**

```javascript
{
  "name": "node-web-api",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "scripts": {
    "start": "nodemon index.js"
  },
  "dependencies": {
    "bcrypt": "^5.1.0",
    "colors": "^1.4.0",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "jsonwebtoken": "^8.5.1",
    "mysql2": "^2.3.3",
    "nodemon": "^2.0.22",
    "sequelize": "^6.32.1",
    "sequelize-cli": "^6.6.1"
  }
}

// Note: dependencies versions may vary.
```

### [**Step 5 - Define the Connection Configuration to MySQL Server**](#table-of-contents)

```javascript
/* config/config.json */
{
  "development": {
    "user": "root",
    "password": "password",
    "database": "warehouse",
    "host": "localhost",
    "port": "3306",
    "dialect": "mysql"
  }
}

```

### [**Step 6 - Define the Models (using Sequelize)**](#table-of-contents)

**Car Model**

```javascript
/* models/car.js */
module.exports = (sequelize, Sequelize) => {
  const car = sequelize.define(
    "car",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      model: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      purchaseDate: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    },
    {
      // automatically pluralizes the model name in database e.g. user -> users (database table), car -> cars (database table)
      freezeTableName: false,
    }
  );

  return car;
};
```

**User Model**

```javascript
/* models/user.js */
module.exports = (sequelize, Sequelize) => {
  const user = sequelize.define(
    "user",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          // usernames must be letters, numbers and underscores with a minimum length of 3
          is: /^\w{3,}$/, // regex expression
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      // automatically pluralizes the model name in database e.g. user -> users (database table), car -> cars (database table)
      freezeTableName: false,
    }
  );

  return user;
};
```

### [**Step 7 - Define the Models Associations**](#table-of-contents)

```javascript
/* sequelize/associations.js */
function associations(sequelize) {
  const { user, car } = sequelize.models;

  user.hasMany(car);
  car.belongsTo(user);
}

module.exports = { associations };
```

### [**Step 8 - Sequelize the Models**](#table-of-contents)

**Include External Modules (exist in seperate files)**

```javascript
/* sequelize/index.js */
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const config = require(__dirname + "/../config/config.json")["development"]; // "development" key from config.json
const models = path.join(__dirname, "models");
const { associations } = require("./associations");
const db = {};
```

**Instantiate Sequelize**

```javascript
/* sequelize/index.js */
const sequelize = new Sequelize(
  config.database,
  config.user,
  config.password,
  config
);
```

**Sequelize the Models**

```javascript
/* sequelize/index.js */
fs.readdirSync(models).forEach((file) => {
  // read each model file (folder models) and sequelize it
  const model = require(path.join(models, file))(sequelize, Sequelize);

  db[model.name] = model;
});
```

**Apply Associations (always after Sequelize the Models)**

```javascript
/* sequelize/index.js */
associations(sequelize);
```

**Make Sequelized Models Available as a Module**

```javascript
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
```

### [**Step 9 - JWT Authentication**](#table-of-contents)

**Include External Modules (exist in seperate files)**

```javascript
/* jwt.js */
const { sign, verify, decode } = require("jsonwebtoken");
```

**Method for Creating a JWT Token**

_It creates a JWT Token based on the username and id retrieved from the database and a fixed secret key_

```javascript
/* jwt.js */
const createTokens = (user) => {
  const accessToken = sign(
    { username: user.username, id: user.id },
    "KKKmyJwtsecretKeykkk" // enter the secret key here or better place it in an external .env file
  );

  return accessToken;
};
```

**Method for Validating a JWT Token**

_It validates a JWT Token that is stored within an httpOnly Cookie_

```javascript
/* jwt.js */
const validateToken = (req, res, next) => {
  const accessToken = req.cookies["access-token"];

  if (!accessToken)
    return res.status(400).json({ error: "User not Authenticated!" });

  try {
    const validToken = verify(accessToken, "KKKmyJwtsecretKeykkk"); // enter the secret key here or better place it in an external .env file
    if (validToken) {
      req.authenticated = true;
      return next();
    }
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};
```

**Method for Decoding a JWT Token**

_It decodes a JWT Token that is stored within an httpOnly Cookie returning an object with properties the username and id_

```javascript
/* jwt.js */
const decodeToken = (req) => {
  const token = req.cookies["access-token"]; // httpOnly JWT token
  const user = decode(token);

  return user; // {{ username: user.username, id: user.id }}
};
```

**Make Methods Available as a Module**

```javascript
/* jwt.js */
module.exports = { createTokens, validateToken, decodeToken };
```

### [**Step 10 - Define the Web API Endpoints**](#table-of-contents)

**Include External Modules (exist in seperate files)**

```javascript
/* index.js */
const config = require(__dirname + "/config/config.json")["development"]; // "development" key from config.json
const mysql = require("mysql2/promise");
const colors = require("colors");
const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const db = require("./sequelize");
const { user, car } = require("./sequelize");
const cookieParser = require("cookie-parser");
const { createTokens, validateToken, decodeToken } = require("./jwt");
```

**Apply Middlewares**

```javascript
/* index.js */
app.use(express.json());
app.use(cors());
app.use(cookieParser());
```

**Define the Web API Endpoints**

```javascript
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

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

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userObj = await user.findOne({ where: { username: username } });

  if (!userObj) {
    res.status(400).json({ error: "User Doesn't Exist" });

    return;
  }

  const dbPassword = userObj.password;

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

app.post("/logout", validateToken, async (req, res) => {
  const userObj = decodeToken(req);
  const accessToken = createTokens(userObj);

  res.cookie("access-token", accessToken, {
    maxAge: -1, // expires immediatelly
    httpOnly: true,
  });

  res.json("LOGGED OUT");
});

app.post("/cars", validateToken, async (req, res) => {
  const user = decodeToken(req);
  const { model, purchaseDate } = req.body;

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

app.get("/cars", validateToken, async (req, res) => {
  const user = decodeToken(req);

  const cars = await car.findAll({
    where: { userId: user.id },
  });
  res.json({ cars: cars });
});

app.get("/user", validateToken, (req, res) => {
  const user = decodeToken(req);

  res.json({ username: user.username, id: user.id });
});
```

### [**Step 11 - Create the Database**](#table-of-contents)

**Method for connecting to MySQL Server and creating the MySQL Database**

```javascript
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
```

**Call the initialize method with the callBack function sync as argument**

```javascript
initialize(sync);
```

**Function sync() is called back on completion of the initialize method**

_It creates the tables automatically and then listens to user requests_

```javascript
function sync() {
  db.sequelize
    .sync()
    .then(() => {
      console.log("MySQL SERVER IS RUNNING...".bgBlue);

      app.listen(3001, () => {
        console.log("API SERVER ON PORT 3001 IS RUNNING...".bgCyan);
      });
    })
    .catch((error) => {
      console.log(error);
    });
}
```

### [**Step 12 - Start the Web API**](#table-of-contents)

**VS Code Command Prompt Terminal**

```
npm start
```

**Result**

```
MySQL SERVER IS RUNNING...

API SERVER ON PORT 3001 IS RUNNING...
```

```python
"""
Node WEB API Endpoints
   e.g. http://localhost:3001/cars

  POST:   /register
  POST:   /login
  POST:   /logout
  POST:   /cars
  DELETE: /cars/:id
  GET:    /cars
  GET:    /user
"""
```
