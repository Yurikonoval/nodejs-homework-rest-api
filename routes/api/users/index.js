const express = require('express')
const router = express.Router()
const userController = require('../../../controllers/users.js')
const guard = require('../../../helpers/guard')
const upload = require('../../../helpers/upload')
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
router.patch(
  '/avatars',
  [guard, upload.single('avatar'), validate.validateUploadAvatar],
  userController.avatars,
)
router.get('/auth/verify/:verificationToken', userController.verify)

module.exports = router
