const express = require('express')
const app = express()

const connection = require('./connection')

connection.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })

app.use(express.json())
app.use(express.urlencoded())

const userRoutes = require('./routes/user')

app.use('/api/users', userRoutes)

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
