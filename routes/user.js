const express = require('express')
const router = express.Router()
const User = require('../models/user')
const { check, validationResult } = require('express-validator');

router.route('/')
  .get(async (req, res, next) => {
    try {
      let {name, surname, perPage = 10, page = 1} = req.query

      let whereClause = {
      }

      name ? whereClause.name = name : null
      surname ? whereClause.surname = surname : null

      let users = await User.findAll({
        where: whereClause,
        limit: perPage,
        offset: (page - 1) * perPage
      })

      let response = {
        perPage,
        page,
        data: users
      }
      res.send(response)
    } catch(e) {

    }
  })
  .post([
    check('email').isEmail(),
    check('name').isString().isLength({ min: 2 }),
    check('surname').isString().isLength({ min: 2 })
  ], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      let newUser = await User.create({...req.body})
      res.send(newUser)
    } catch(e) {
      
    }
  })
module.exports = router