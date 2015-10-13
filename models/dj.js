'use strict';
module.exports = function(sequelize, DataTypes) {
  var dj = sequelize.define('dj', {
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        dj.hasMany(models.party)
      }
    }
  });
  return dj;
};