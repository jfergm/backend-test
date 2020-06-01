const sequelize = require('sequelize')
const Model = sequelize.Model
const connection = require('../connection')

class Task extends Model {}

Task.init({
  name: {
    type: sequelize.STRING,
  },
  description: {
    type: sequelize.TEXT
  },
  score: {
    type: sequelize.INTEGER
  },
  status: {
    type: sequelize.ENUM,
    values: ['active', 'inactive','declined', 'completed']
  }

}, {
  sequelize: connection,
  modelName: 'task'
})

module.exports = Task