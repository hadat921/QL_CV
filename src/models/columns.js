'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Columns extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Columns.hasMany(models.Cards, {
        foreignKey: 'idColumn',
        as: "Cards"
      });

    }
  }
  Columns.init({
    columnName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.STRING,
    // cardOder: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Columns',
  });
  return Columns;
};