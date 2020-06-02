const express = require('express')
const router = express.Router()
const Task = require('../models/task')
const User = require('../models/user')
const Op = require('sequelize').Op

router.route('/')
  .get(async (req, res, next) => {
    try {
      let {name, description, assigner, assignees, status, score, perPage = 10, page = 1} = req.query

      let whereClause = {}

      name ? whereClause.name = name : null
      description ? whereClause.description = description : null

      if(assigner) {
        let assignerUsers = await User.findAll({
          where: {
            [Op.or]: [{name: assigner}, {surname: assigner}]
          }
        })

        let userIDs = []

        assignerUsers.forEach(assignerUser => {
          userIDs.push(assignerUser.getDataValue('id'))
        })

        let projects = Project.findAll({
          where: {
            user_id: {
              [Op.in]: userIDs
            }
          }
        })

        let projectIDs = new Set()

        projects.forEach(project => {
          projectIDs.add(project.getDataValue('id'))
        })

        whereClause.project_id = {
          [Op.in]: Array.from(projectIDs)
        }
      }

      if(assignees) {
        let assigneesArray = JSON.parse(assignees)

        let conditions = {
          [Op.or]: [
            {
              name: {
              [Op.or] : []
              }
            },
            {
              surname: {
              [Op.or]: []
              }
            },
            {  id: {
                [Op.or]: []
              }
            }
          ]
        }

        assigneesArray.forEach(assignee => {
          if(isNaN(assignee)) {
            conditions[Op.or][0].name[Op.or].push(assignee)
            conditions[Op.or][1].surname[Op.or].push(assignee)
          } else {
            conditions[Op.or][2].id[Op.or].push(assignee)
          }
        })

       let assigneesUsers = await User.findAll({
          where: conditions
        })

        let userIDs = []

        assigneesUsers.forEach(assigneesUser => {
          userIDs.push(assigneesUser.getDataValue('id'))
        })

        whereClause.user_id = {
          [Op.in]: userIDs
        }
      }

      if(status) {
        statusArray = JSON.parse(status)
        let or = []
        statusArray.forEach(status => {
          or.push({status})
        })

        whereClause[Op.or] = or
      }

      if(score) {
        whereClause.score = {
          [Op.gt]: score
        }
      }

      let tasks = await Task.findAll({
        limit: 10, 
        offset: (page - 1) * perPage,
        where: whereClause
      }) 

      let response = {
        perPage,
        page,
        data: tasks
      }

      res.send(response)
    } catch(e) {
      console.log(e)
    }
  })
  .post(async (req, res, next) => {
    try {
      let newTask = Task.create({
        ...req.body
      })

      res.send(newTask)
    } catch(e) {

    }
  })

module.exports = router