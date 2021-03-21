const express = require('express')
const router = express.Router()
const userController = require('../../../controllers/users.js')
const guard = require('../../../helpers/guard')
const validate = require('./validation.js')

router.post('/auth/register', validate.createUser, userController.reg)
router.post('/auth/login', validate.loginUser, userController.login)
router.post('/auth/logout', guard, userController.logout)
router.get('/current', guard, userController.current)
router.patch(
  '/',
  guard,
  validate.updateSubscription,
  userController.updateSubscription,
)

module.exports = router
