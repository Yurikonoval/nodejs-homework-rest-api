const mongoose = require('mongoose')
const { Schema, model } = mongoose

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set contact name'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Set contact email'],
      unique: true,
    },
    number: {
      type: String,
      required: [true, 'Set contact phone number'],
      unique: true,
      min: 10,
      max: 15,
    },
    subscription: {
      type: String,
      default: 'free',
    },
    password: {
      type: String,
      required: [true, 'Set contact password'],
      min: 6,
      max: 20,
      default: 'password',
    },
    token: {
      type: String,
      default: '',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
)

const Contact = model('contact', contactSchema)

module.exports = Contact
