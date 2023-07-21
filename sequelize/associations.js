/* declares the association (relation) between the models */
function associations(sequelize) {
  const { user, car } = sequelize.models;

  user.hasMany(car);
  car.belongsTo(user);
}

module.exports = { associations };
