'use strict';
const Sequelize = require('sequelize')

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addColumn('entities', 'displayName', Sequelize.STRING);
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('entities', 'displayName');
  }
};
