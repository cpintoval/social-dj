'use strict';
module.exports = function(sequelize, DataTypes) {
  var song = sequelize.define('song', {
    title: DataTypes.STRING,
    album: DataTypes.STRING,
    artist: DataTypes.STRING,
    voteCount: DataTypes.INTEGER,
    img_url: DataTypes.STRING,
    spotify_id: DataTypes.STRING,
    cookie: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        song.belongsTo(models.party, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        }),
        song.hasMany(models.vote);
      }
    }
  });
  return song;
};