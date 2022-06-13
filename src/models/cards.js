'use strict';
const {
  Model
} = require('sequelize');
const columns = require('./columns');
const user = require('./user');
module.exports = (sequelize, DataTypes) => {
  class Cards extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Cards.belongsTo(models.Users); 
      Cards.belongsTo(models.Columns); 
      
    }
  }
  Cards.init({
    cardName: DataTypes.STRING,
    dueDate: DataTypes.DATE,
    description: DataTypes.STRING,
    attachment: DataTypes.STRING,
    comment: DataTypes.STRING,
    idColumn: DataTypes.STRING,
    createBy: DataTypes.STRING,
    createAt: DataTypes.DATE,
    updateAt: DataTypes.DATE,


  }, {
    sequelize,
    modelName: 'Cards',
  });
  return Cards;
};