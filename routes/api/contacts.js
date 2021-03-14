const express = require('express')
const router = express.Router()
const contactsController = require('../../controllers/contacts.js')
const validate = require('./validation.js')

router
  .get('/', contactsController.getAll)
  .post('/', validate.addContact, contactsController.create)

router
  .get('/:contactId', contactsController.getById)
  .delete('/:contactId', contactsController.remove)
  .patch('/:contactId', validate.updateContact, contactsController.update)

module.exports = router
