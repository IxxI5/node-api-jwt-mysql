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

This project is a small Web API developed in NodeJS demonstrating the following:

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

**Connect to MySQL Server**

- Open MySQL Workbench
- Create a Connection named **node-api** and set:

  ```
  User: root

  Password: password
  ```

  Then press connect.

  **Note**: In case you want to use other values, make sure to update the config/config.js accordingly

### Installation

- Open a **Command Prompt** Terminal (VS Code)
- Create a Folder and clone the Git Project

  ```
  mkdir api

  cd api

  git https://github.com/IxxI5/node-api-jwt-mysql.git
  ```

- Install the dependecies
  ```
  npm install
  ```
- Run the web api
  ```
  npm start
  ```

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

Copyright (c) 2015 Chris Kibble

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
