'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.belongsTo(models.Game, { foreignKey: "GameId" })
    }

    get formatDate() {
      const date = new Date(this.eventDate)
      return date.toISOString().split('T')[0]
    }

    get formatPrize() {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR"
      }).format(this.totalPrize);
    }
  }
  Event.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    totalPrize: DataTypes.INTEGER,
    eventPoster: DataTypes.STRING,
    eventDate: DataTypes.DATE,
    eventType: DataTypes.STRING,
    eventStatus: DataTypes.STRING,
    GameId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};