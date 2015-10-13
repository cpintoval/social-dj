'use strict';
module.exports = function(sequelize, DataTypes) {
  var song = sequelize.define('song', {
    title: DataTypes.STRING,
    album: DataTypes.STRING,
    votes: DataTypes.INTEGER,
    img_url: DataTypes.STRING,
    spotify_id: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        song.belongsTo(models.party, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });
  return song;
};