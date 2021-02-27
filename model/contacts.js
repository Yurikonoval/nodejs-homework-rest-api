const fs = require('fs/promises')
const path = require('path')
const { v4: uuid } = require('uuid')

const contactsPath = path.join(__dirname, './contacts.json')

const listContacts = async () => {
  const data = await fs.readFile(contactsPath)
  return JSON.parse(data)
}

const getContactById = async contactId => {
  const contacts = await listContacts()
  const searchContact = contacts.find(
    contact => String(contact.id) === contactId,
  )
  return searchContact
}

const removeContact = async contactId => {
  const contacts = await listContacts()
  const contact = contacts.find(contact => String(contact.id) === contactId)
  const newContactList = contacts.filter(
    contact => String(contact.id) !== contactId,
  )
  await fs.writeFile(contactsPath, JSON.stringify(newContactList))
  return contact
}

const addContact = async body => {
  const contacts = await listContacts()
  const newContact = { id: uuid(), body }
  const newContacts = [...contacts, newContact]
  await fs.writeFile(contactsPath, JSON.stringify(newContacts))
  return newContact
}

const updateContact = async (contactId, body) => {
  const contacts = await listContacts()
  const searchContact = contacts.find(
    contact => String(contact.id) === contactId,
  )
  const newContact = { ...searchContact, ...body }
  const newContacts = contacts.map(contact =>
    String(contact.id) === contactId ? newContact : contact,
  )
  await fs.writeFile(contactsPath, JSON.stringify(newContacts))
  return newContact
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
