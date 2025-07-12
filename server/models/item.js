'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
  Item.belongsTo(models.User, { foreignKey: 'userId' });
  // An item can be requested in many swaps
  Item.hasMany(models.Swap, { as: 'RequestedInSwaps', foreignKey: 'requested_item_id' });
}
  }
 Item.init({
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  category: DataTypes.STRING,
  status: DataTypes.STRING,
  // Change `image` to `images` and update its type
  images: DataTypes.ARRAY(DataTypes.STRING),
  // Add the new fields
  size: DataTypes.STRING,
  condition: DataTypes.STRING,
  brand: DataTypes.STRING,
  color: DataTypes.STRING,
  material: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
      sequelize,
      modelName: 'Item',
    });
  return Item;
};