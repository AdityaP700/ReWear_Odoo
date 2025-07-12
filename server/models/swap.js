'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Swap extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
   static associate(models) {
  // Each swap is initiated by one user
  Swap.belongsTo(models.User, { as: 'Requester', foreignKey: 'requester_id' });
  // Each swap is for an item owned by another user
  Swap.belongsTo(models.User, { as: 'Responder', foreignKey: 'responder_id' });
  // Each swap targets one item
  Swap.belongsTo(models.Item, { as: 'RequestedItem', foreignKey: 'requested_item_id' });
}
  }
  Swap.init({
    requester_id: DataTypes.INTEGER,
    responder_id: DataTypes.INTEGER,
    requested_item_id: DataTypes.INTEGER,
    offered_item_id: DataTypes.INTEGER,
    status: DataTypes.STRING,
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Swap',
  });
  return Swap;
};