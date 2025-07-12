'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // We are simply adding all the new columns to the table.
    // Since the old 'image' column is gone, we create the new 'images' column directly.
    await queryInterface.addColumn('Items', 'images', {
      type: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.STRING),
      defaultValue: [],
    });
    
    await queryInterface.addColumn('Items', 'size', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('Items', 'condition', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('Items', 'brand', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('Items', 'color', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('Items', 'material', { type: Sequelize.STRING, allowNull: true });
  },

  async down(queryInterface, Sequelize) {
    // This function defines how to UNDO the migration
    await queryInterface.removeColumn('Items', 'material');
    await queryInterface.removeColumn('Items', 'color');
    await queryInterface.removeColumn('Items', 'brand');
    await queryInterface.removeColumn('Items', 'condition');
    await queryInterface.removeColumn('Items', 'size');
    await queryInterface.removeColumn('Items', 'images');
  }
};