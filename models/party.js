'use strict';
module.exports = function(sequelize, DataTypes) {
  var party = sequelize.define('party', {
    name: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        party.hasMany(models.song),
        party.belongsTo(models.dj, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });
  return party;
};