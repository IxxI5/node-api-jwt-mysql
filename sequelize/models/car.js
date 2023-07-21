/* car model */
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
