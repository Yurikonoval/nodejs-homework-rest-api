const User = require('./schemas/user')

const findByEmail = async email => {
  return await User.findOne({ email })
}

const findById = async id => {
  return await User.findOne({ _id: id })
}

const findByVerificationToken = async verificationToken => {
  return await User.findOne({ verificationToken })
}

const create = async ({
  name,
  email,
  password,
  sex,
  verify,
  verificationToken,
}) => {
  const user = new User({
    name,
    email,
    password,
    sex,
    verify,
    verificationToken,
  })
  return await user.save()
}

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token })
}

const updateVerificationToken = async (id, verify, verificationToken) => {
  return await User.findOneAndUpdate({ _id: id }, { verify, verificationToken })
}

const updateUserSub = async (id, subscription) => {
  return await User.updateOne({ _id: id }, { subscription })
}

const updateAvatar = async (id, avatar) => {
  return await User.updateOne({ _id: id }, { avatar })
}

// const updateAvatar = async (id, avatar, imgIdCloud) => {
//   return await User.updateOne({ _id: id }, { avatar, imgIdCloud })
// }

module.exports = {
  findByEmail,
  findById,
  findByVerificationToken,
  create,
  updateToken,
  updateVerificationToken,
  updateUserSub,
  updateAvatar,
}
