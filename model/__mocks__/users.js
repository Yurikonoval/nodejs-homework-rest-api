const { users } = require('./data')
const bcrypt = require('bcryptjs')

const findByEmail = jest.fn(email => {
  const [user] = users.filter(el => String(el.email) === String(email))
  return user
})

const findById = jest.fn(id => {
  const [user] = users.filter(el => String(el._id) === String(id))
  return user
})

const create = jest.fn(({ name = 'Guest', email, password, sex = 'm' }) => {
  const pass = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
  const newUser = {
    name,
    email,
    password: pass,
    sex,
    _id: '605db6fc5bf4ff25dce3eb73',
    validPassword: function (pass) {
      return bcrypt.compareSync(pass, this.password)
    },
  }
  users.push(newUser)
  return newUser
})

const updateToken = jest.fn((id, token) => {
  return {}
})

const updateUserSub = jest.fn((id, subscription) => {
  return {}
})

const updateAvatar = jest.fn((id, avatar) => {
  return {}
})

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
