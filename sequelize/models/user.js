/* user model */
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
