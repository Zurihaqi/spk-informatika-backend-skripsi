module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn("Recommendations", "percentage", {
        type: Sequelize.ARRAY(Sequelize.FLOAT),
        allowNull: true,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn("Recommendations", "percentage", {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: true,
      }),
    ]);
  },
};
