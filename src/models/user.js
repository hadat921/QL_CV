'use strict';
const {
  Model
} = require('sequelize');
const cards = require('./cards');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Users.hasMany(models.Cards, {
        foreignKey: 'createBy'
      });   }
  }
  Users.init({
    userName: DataTypes.STRING,
    realName: DataTypes.STRING,
    address: DataTypes.STRING,
    password: DataTypes.STRING,
    avatar: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    




  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};