/* eslint-disable unicorn/prefer-module */

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createSchema('gulls');
  },
  down: async (queryInterface) => {
    await queryInterface.dropSchema('gulls');
  },
};
