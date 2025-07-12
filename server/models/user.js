'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
  User.hasMany(models.Item, { foreignKey: 'userId' });
  // A user can make many swap requests
  User.hasMany(models.Swap, { as: 'MadeSwaps', foreignKey: 'requester_id' });
  // A user can receive many swap requests
  User.hasMany(models.Swap, { as: 'ReceivedSwaps', foreignKey: 'responder_id' });
}
  }
  User.init({
        fullName: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    points_balance: DataTypes.INTEGER,
    is_admin: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};