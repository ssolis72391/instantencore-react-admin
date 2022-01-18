'use strict';
const Sequelize = require('sequelize')

module.exports = {
  up: async (queryInterface) => {
    await Promise.all([
      queryInterface.changeColumn('entities', 'displayName', {
        type: Sequelize.STRING(1024),
        allowNull: false
      }),
      queryInterface.addColumn('entities', 'email', {
        type: Sequelize.STRING(256),
        allowNull: false
      })]
    );
  },

  down: async (queryInterface) => {
    await Promise.all([
      queryInterface.changeColumn('entities', 'displayName', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      queryInterface.removeColumn('entities', 'email')]
    );
  }
};
