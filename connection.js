require('dotenv').config()

const sequelize = require('sequelize')

const connection = new sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres'
})


module.exports = connection