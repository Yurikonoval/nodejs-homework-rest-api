const Joi = require('joi')
const { HttpCode } = require('../../../helpers/constants')

const schemaCreateUser = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required(),
})

const schemaLoginUser = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required(),
})

const schemaUpdateSubscription = Joi.object({
  subscription: Joi.any().valid('free', 'pro', 'premium'),
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

module.exports.createUser = (req, res, next) => {
  return validate(schemaCreateUser, req.body, next)
}

module.exports.loginUser = (req, res, next) => {
  return validate(schemaLoginUser, req.body, next)
}

module.exports.updateSubscription = (req, res, next) => {
  return validate(schemaUpdateSubscription, req.body, next)
}

module.exports.validateUploadAvatar = (req, res, next) => {
  if (!req.file) {
    return res.status(HttpCode.BAD_REQUEST).json({
      status: 'error',
      code: HttpCode.BAD_REQUEST,
      data: 'Bad request',
      message: 'Field of avatar with file not found',
    })
  }
  next()
}
