const jwt = require('jsonwebtoken')
const Users = require('../model/users.js')
const { HttpCode } = require('../helpers/constants')
require('dotenv').config()
const SECRET_KEY = process.env.JWT_SECRET

const reg = async (req, res, next) => {
  try {
    const { name, email, password, sex } = req.body
    const user = await Users.findByEmail(email)
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        data: 'Conflict',
        message: 'Email in use',
      })
    }

    const newUser = await Users.create(req.body)
    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        email: newUser.email,
        name: newUser.name,
        subscription: user.subscription,
      },
    })
  } catch (e) {
    next(e)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await Users.findByEmail(email)
    const isValidPassword = await user.validPassword(password)
    if (!user || !isValidPassword) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        data: 'unauthorized',
        message: 'Invalid credentials',
      })
    }

    const id = user._id
    const payload = { id }
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '4h' })
    await Users.updateToken(id, token)

    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        token,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      },
    })
  } catch (e) {
    next(e)
  }
}
const logout = async (req, res, next) => {
  const id = req.user.id
  await Users.updateToken(id, null)
  return res.status(HttpCode.NO_CONTENT).json({ message: 'No content' })
}

const current = async (req, res, next) => {
  try {
    const id = req.user.id
    const user = await Users.findById(id)
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        email: user.email,
        subscription: user.subscription,
      },
    })
  } catch (e) {
    next(e)
  }
}

const updateSubscription = async (req, res, next) => {
  try {
    const id = req.user.id
    await Users.updateUserSub(id, req.body.subscription)
    const user = await Users.findById(id)

    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        name: user.name,
        email: user.email,
        subscription: user.subscription,
      },
    })
  } catch (e) {
    next(e)
  }
}

module.exports = { reg, login, logout, current, updateSubscription }
