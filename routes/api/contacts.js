const express = require('express')
const router = express.Router()
const Contacts = require('../../model/contacts.js')
const validate = require('./validation.js')

router.get('/', async (req, res, next) => {
  try {
    const contacts = await Contacts.listContacts()
    return res.json({
      status: 'success',
      code: '200',
      data: {
        contacts,
      },
    })
  } catch (e) {
    next(e)
  }
})

router.get('/:contactId', async (req, res, next) => {
  try {
    const contact = await Contacts.getContactById(req.params.contactId)
    if (contact) {
      return res.json({
        status: 'success',
        code: '200',
        data: {
          contact,
        },
      })
    } else {
      return res.status(404).json({
        status: 'error',
        code: '404',
        message: 'Not found',
      })
    }
  } catch (e) {
    next(e)
  }
})

router.post('/', validate.addContact, async (req, res, next) => {
  const body = req.body
  if (body.name && body.email && body.number) {
    try {
      const contact = await Contacts.addContact(body)
      return res.status(201).json({
        status: 'success',
        code: '201',
        data: {
          contact,
        },
      })
    } catch (e) {
      next(e)
    }
  } else {
    return res.status(400).json({
      status: 'error',
      code: '400',
      message: 'missing required name field',
    })
  }
})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const contact = await Contacts.removeContact(req.params.contactId)
    if (contact) {
      return res.json({
        status: 'success',
        code: '200',
        message: 'contact deleted',
        data: {
          contact,
        },
      })
    } else {
      return res.status(404).json({
        status: 'error',
        code: '404',
        message: 'Not found',
      })
    }
  } catch (e) {
    next(e)
  }
})

router.patch('/:contactId', validate.updateContact, async (req, res, next) => {
  try {
    const contact = await Contacts.updateContact(req.params.contactId, req.body)
    if (JSON.stringify(req.body) === '{}') {
      return res.status(400).json({
        status: 'error',
        code: '400',
        message: 'missing fields',
      })
    }
    if (contact) {
      return res.json({
        status: 'success',
        code: '200',
        data: {
          contact,
        },
      })
    } else {
      return res.status(404).json({
        status: 'error',
        code: '404',
        message: 'Not found',
      })
    }
  } catch (e) {
    next(e)
  }
})

module.exports = router
