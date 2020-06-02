const express = require('express')
const router = express.Router()
const Project = require('../models/project')
const Op = require('sequelize').Op
const User = require('../models/user')
const Task = require('../models/task')

router.route('/')
  .get(async (req, res, next) => {
    try {
      let {name, description, status, assigner, assignees, taskScore, perPage = 10, page = 1} = req.query

      let whereClause = {
      }

      // where name = name
      name ? whereClause.name = name : null

      // where surname = surname
      description ? whereClause.surname = surname : null
      
      if(status) {
        statusArray = JSON.parse(status)
        let or = []
        statusArray.forEach(status => {
          
          or.push({status})
        })

        // where (status = status or status = status)
        whereClause[Op.or] = or
      }

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

        //where user_id in (user_id, user_id)
        whereClause.user_id = {
          [Op.in]: userIDs
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

        let tasks = await Task.findAll({
          where: {
            user_id: {
              [Op.in] : userIDs
            }
          }
        })

        let projectIDs = new Set()

        tasks.forEach(task => {
          projectIDs.add(task.getDataValue('project_id'))
        })

        //where id in (id, id)
        whereClause.id = {
          [Op.in]: Array.from(projectIDs)
        }
      }

      if(taskScore) {
        let tasks = await Task.findAll({
          where: {
            score: {
              [Op.gt]: taskScore
            }
          }
        })

        let projectIDs = new Set()

        tasks.forEach(task => {
          projectIDs.add(task.getDataValue('project_id'))
        })

        //where id in (id, id)
        whereClause.id = {
          [Op.in]: Array.from(projectIDs)
        }
      }

      let projects = await Project.findAll({
        where: whereClause,
        limit: perPage,
        offset: (page - 1) * perPage
      })

      let response = {
        perPage,
        page,
        data: projects
      }
      res.send(response)
    } catch(e) {
    }
  })
  .post(async (req, res, next) => {
    try {
      let newProject = await Project.create({
        ...req.body
      })

      res.send(newProject)
    } catch(e) {

    }
  })

module.exports = router