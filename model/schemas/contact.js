const mongoose = require('mongoose')
const { Schema, model, SchemaTypes } = mongoose
const mongoosePaginate = require('mongoose-paginate-v2')

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
    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
)

contactSchema.plugin(mongoosePaginate)
const Contact = model('contact', contactSchema)

module.exports = Contact
