'use strict';
module.exports = function(sequelize, DataTypes) {
  var vote = sequelize.define('vote', {
    cookie: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      vote.belongsTo(models.party, {
        onDelete: "CASCADE",
        foreignKey: {
          allowNull: false
        }
      }),
      vote.belongsTo(models.song, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });
  return vote;
};