const jwt = require('jsonwebtoken')
const fs = require('fs').promises
const Users = require('../model/users.js')
const path = require('path')
const Jimp = require('jimp')
const { nanoid } = require('nanoid')
require('dotenv').config()
// const { promisify } = require('util')
// const cloudinary = require('cloudinary').v2
const createFolderIsExist = require('../helpers/create-dir')
const { HttpCode } = require('../helpers/constants')
const EmailService = require('../services/email')

const SECRET_KEY = process.env.JWT_SECRET

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET,
// })

// const uploadCloud = promisify(cloudinary.uploader.upload)

const reg = async (req, res, next) => {
  try {
    const { name, email } = req.body
    const user = await Users.findByEmail(email)
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        data: 'Conflict',
        message: 'Email in use',
      })
    }
    const verificationToken = nanoid()
    const emailService = new EmailService(process.env.NODE_ENV)
    await emailService.sendEmail(verificationToken, email, name)
    const newUser = await Users.create({
      ...req.body,
      verify: false,
      verificationToken,
    })
    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        email: newUser.email,
        name: newUser.name,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
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
    const isValidPassword = await user?.validPassword(password)
    if (!user || !isValidPassword || !user.verify) {
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

const avatars = async (req, res, next) => {
  try {
    const id = req.user.id
    const avatarURL = await saveAvatarToStatic(req)
    // const {
    //   public_id: imgIdCloud,
    //   secure_url: avatarURL,
    // } = await saveAvatarToCloud(req)
    // await Users.updateAvatar(id, avatarURL, imgIdCloud)

    await Users.updateAvatar(id, avatarURL)
    return res.json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        avatarURL,
      },
    })
  } catch (e) {
    next(e)
  }
}
const saveAvatarToStatic = async req => {
  const id = req.user.id
  const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS
  const pathFile = req.file.path
  const newNameAvatar = `${Date.now()}-${req.file.originalname}`
  const img = await Jimp.read(pathFile)
  await img
    .autocrop()
    .cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(pathFile)
  await createFolderIsExist(path.join(AVATARS_OF_USERS, id))
  await fs.rename(pathFile, path.join(AVATARS_OF_USERS, id, newNameAvatar))
  const avatarURL = path.normalize(path.join(id, newNameAvatar))
  try {
    await fs.unlink(
      path.join(process.cwd(), AVATARS_OF_USERS, req.user.avatarURL),
    )
  } catch (e) {
    console.log(e.message)
  }
  return avatarURL
}

const verify = async (req, res, next) => {
  try {
    const user = await Users.findByVerificationToken(
      req.params.verificationToken,
    )
    if (user) {
      await Users.updateVerificationToken(user.id, true, null)
      return res.json({
        status: 'success',
        code: HttpCode.OK,
        message: 'Verification successful!',
      })
    }
    return res.status(HttpCode.BAD_REQUEST).json({
      status: 'error',
      code: HttpCode.BAD_REQUEST,
      data: 'Bad request',
      message: 'Link is not valid',
    })
  } catch (e) {
    next(e)
  }
}

// const saveAvatarToCloud = async req => {
//   const pathFile = req.file.path
//   const result = await uploadCloud(pathFile, {
//     folder: 'photo',
//     transformation: { width: 250, height: 250, crop: 'fill' },
//   })
//   cloudinary.uploader.destroy(req.user.imgIdCloud, (err, result) => {
//     console.log(err, result)
//   })
//   try {
//     await fs.unlink(pathFile)
//   } catch (e) {
//     console.log(e.message)
//   }
//   return result
// }

module.exports = {
  reg,
  login,
  logout,
  current,
  updateSubscription,
  avatars,
  verify,
}
