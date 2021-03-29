const contacts = [
  {
    _id: '605649dfdbcfe01d407cc191a',
    name: 'yurii',
    email: 'mail@mail.com',
    number: '09765532321',
    owner: '6055beb741627e1cd822ccde',
  },
  {
    _id: '605762f57976441f94a80497b',
    name: 'test1',
    email: 'test1@gmail.com',
    number: '9929143792',
    owner: '6055beb741627e1cd822ccde',
  },
]

const newContact = {
  name: 'Vlad',
  email: 'Vlad@gmail.com',
  number: '9342221199',
}

const User = {
  _id: '605db6fc5bf4ff25dce3eb73',
  name: 'Guest',
  sex: 'm',
  subscription: 'free',
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNWRiNmZjNWJmNGZmMjVkY2UzZWI3MyIsImlhdCI6MTYxNjg2NzY4MiwiZXhwIjoxNjE2ODgyMDgyfQ.owGwk2wkFyAaWTReQRO-4dXDiUsMKbRzucJU2wHMt3Q',
  email: 'testtest@gmail.com',
  password: '$2a$08$uCh9qQxY1gCtZA7M0Ns7ReLOtX5xK4BuJA.QRTwwZt65QxJy52GTm',
  avatarURL:
    'https://s.gravatar.com/avatar/78d246ee2316fef54c2e5f2ce853cad0?s=250',
  updatedAt: '2021-03-27T08:43:41.454+00:00',
  imgIdCloud: null,
}

const users = []
users[0] = User

const newUser = { email: 'test@test.com', password: '123456' }

module.exports = { contacts, newContact, User, users, newUser }
