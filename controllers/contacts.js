const Contacts = require('../model/contacts.js')
const { HttpCode } = require('../helpers/constants')

const getAll = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contacts = await Contacts.listContacts(userId, req.query)
    return res.json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        ...contacts,
      },
    })
  } catch (e) {
    next(e)
  }
}

const getById = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contact = await Contacts.getContactById(req.params.contactId, userId)
    if (contact) {
      return res.json({
        status: 'success',
        code: HttpCode.OK,
        data: {
          contact,
        },
      })
    } else {
      return res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        message: 'Not found',
      })
    }
  } catch (e) {
    next(e)
  }
}

const create = async (req, res, next) => {
  const body = req.body
  if (body.name && body.email && body.number) {
    try {
      const userId = req.user.id
      const contact = await Contacts.addContact({ ...body, owner: userId })
      return res.status(HttpCode.CREATED).json({
        status: 'success',
        code: HttpCode.CREATED,
        data: {
          contact,
        },
      })
    } catch (e) {
      next(e)
    }
  } else {
    return res.status(HttpCode.BAD_REQUEST).json({
      status: 'error',
      code: HttpCode.BAD_REQUEST,
      message: 'missing required name field',
    })
  }
}

const remove = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contact = await Contacts.removeContact(req.params.contactId, userId)
    if (contact) {
      return res.json({
        status: 'success',
        code: HttpCode.OK,
        message: 'contact deleted',
        data: {
          contact,
        },
      })
    } else {
      return res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        message: 'Not found',
      })
    }
  } catch (e) {
    next(e)
  }
}

const update = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contact = await Contacts.updateContact(
      req.params.contactId,
      req.body,
      userId,
    )
    if (JSON.stringify(req.body) === '{}') {
      return res.status(HttpCode.BAD_REQUEST).json({
        status: 'error',
        code: HttpCode.BAD_REQUEST,
        message: 'missing fields',
      })
    }
    if (contact) {
      return res.json({
        status: 'success',
        code: HttpCode.OK,
        data: {
          contact,
        },
      })
    } else {
      return res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        message: 'Not found',
      })
    }
  } catch (e) {
    next(e)
  }
}

module.exports = {
  getAll,
  getById,
  create,
  remove,
  update,
}
