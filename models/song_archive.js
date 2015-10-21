'use strict';
module.exports = function(sequelize, DataTypes) {
  var song_archive = sequelize.define('song_archive', {
    song_id: DataTypes.STRING,
    party_id: DataTypes.STRING,
    song_name: DataTypes.STRING,
    voteCount: DataTypes.INTEGER,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return song_archive;
};