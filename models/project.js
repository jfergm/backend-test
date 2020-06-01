const sequelize = require('sequelize')
const Model = sequelize.Model
const connection = require('../connection')

class Project extends Model {}

Project.init({
  name: {
    type: sequelize.STRING,
  },
  body: {
    type: sequelize.TEXT
  },
  status: {
    type: sequelize.ENUM,
    values: ['active', 'inactive','declined', 'completed']
  },
  user_id: {
    type: sequelize.INTEGER
  }

}, {
  underscored: true,
  sequelize: connection,
  modelName: 'project'
})

module.exports = Project