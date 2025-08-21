'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      totalPrize: {
        type: Sequelize.STRING,
        allowNull: false
      },
      eventPoster: {
        type: Sequelize.STRING,
        allowNull: false
      },
      eventDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      eventType: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "ONLINE"
      },
      eventStatus: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Events');
  }
};