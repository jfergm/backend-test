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

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
