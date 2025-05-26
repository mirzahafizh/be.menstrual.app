'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MenstrualCycle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
static associate(models) {
  MenstrualCycle.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user'
  });


    }
  }
  MenstrualCycle.init({
    user_id: DataTypes.INTEGER,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    cycle_length: DataTypes.INTEGER,
    period_length: DataTypes.INTEGER,
    ovulation_date: DataTypes.DATE,
    fertile_window_start: DataTypes.DATE,
    fertile_window_end: DataTypes.DATE,
    notes: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'MenstrualCycle',
    tableName: 'menstrual_cycles'
  });
  return MenstrualCycle;
};