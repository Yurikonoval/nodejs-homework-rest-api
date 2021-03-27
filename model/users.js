const User = require('./schemas/user')

const findByEmail = async email => {
  return await User.findOne({ email })
}

const findById = async id => {
  return await User.findOne({ _id: id })
}

const create = async ({ name, email, password, sex }) => {
  const user = new User({ name, email, password, sex })
  return await user.save()
}

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token })
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
  create,
  updateToken,
  updateUserSub,
  updateAvatar,
}
