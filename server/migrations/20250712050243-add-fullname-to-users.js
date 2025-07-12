'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // This function is executed when you run the migration.
    // It adds the 'fullName' column to the 'Users' table.
    await queryInterface.addColumn('Users', 'fullName', {
      type: Sequelize.STRING,
      allowNull: true, // It's good practice to allow nulls when adding columns to existing tables
    });
  },

  async down(queryInterface, Sequelize) {
    // This function is executed if you need to reverse the migration.
    // It removes the 'fullName' column from the 'Users' table.
    await queryInterface.removeColumn('Users', 'fullName');
  }
};