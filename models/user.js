const sequelize = require('sequelize')
const Model = sequelize.Model
const connection = require('../connection')

class User extends Model {}

User.init({
  email: {
    type: sequelize.STRING,
  },
  name: {
    type: sequelize.STRING
  },
  surname: {
    type: sequelize.STRING
  }

}, {
  underscored: true,
  sequelize: connection,
  modelName: 'user'
})

module.exports = User