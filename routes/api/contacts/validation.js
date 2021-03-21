const Joi = require('joi')
const { HttpCode } = require('../../../helpers/constants')

const schemaAddContact = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  number: Joi.string().min(10).max(30).required(),
})

const schemaUpdateContact = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  number: Joi.string().min(10).max(30),
})

const validate = (schema, obj, next) => {
  const { error } = schema.validate(obj)
  if (error) {
    const [{ message }] = error.details
    return next({
      status: HttpCode.BAD_REQUEST,
      message: `Filed: ${message.replace(/"/g, '')}`,
    })
  }
  next()
}

module.exports.addContact = (req, res, next) => {
  return validate(schemaAddContact, req.body, next)
}

module.exports.updateContact = (req, res, next) => {
  return validate(schemaUpdateContact, req.body, next)
}
