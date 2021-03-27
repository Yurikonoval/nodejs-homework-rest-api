const request = require('supertest')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const { User, contacts, newContact } = require('../model/__mocks__/data')
const app = require('../app')

const SECRET_KEY = process.env.JWT_SECRET
const issueToken = (payload, secret) => jwt.sign(payload, secret)
const token = issueToken({ id: User._id }, SECRET_KEY)
User.token = token

jest.mock('../model/contacts.js')
jest.mock('../model/users.js')

describe('Testing the route api/contacts', () => {
  let idNewContact
  describe('should handle get request', () => {
    it('should return 200 status for get all contacts', async done => {
      const res = await request(app)
        .get('/api/contacts')
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toEqual(200)
      expect(res.body).toBeDefined()
      expect(res.body.data.contacts).toBeInstanceOf(Array)
      done()
    })
    it('should return 200 status by id', async done => {
      const contact = contacts[0]
      const res = await request(app)
        .get(`/api/contacts/${contact._id}`)
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toEqual(200)
      expect(res.body).toBeDefined()
      expect(res.body.data.contact).toHaveProperty('_id')
      expect(res.body.data.contact._id).toBe(contact._id)
      done()
    })
    it('should return 404 status by wrong id', async done => {
      const wrongId = 3232
      const res = await request(app)
        .get(`/api/contacts/${wrongId}`)
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toEqual(404)
      expect(res.body).toBeDefined()
      done()
    })
  })
  describe('should handle post request', () => {
    it('should return 201 status create contact', async done => {
      const res = await request(app)
        .post(`/api/contacts`)
        .set('Authorization', `Bearer ${token}`)
        .send(newContact)
        .set('Accept', 'application/json')

      expect(res.status).toEqual(201)
      expect(res.body).toBeDefined()
      idNewContact = res.body.data.contact._id
      done()
    })
    it('should return 400 status for wrong field', async done => {
      const res = await request(app)
        .post(`/api/contacts`)
        .set('Authorization', `Bearer ${token}`)
        .send({ ...newContact, test: 1 })
        .set('Accept', 'application/json')

      expect(res.status).toEqual(400)
      expect(res.body).toBeDefined()
      done()
    })
    it('should return 400 status without required field name', async done => {
      const res = await request(app)
        .post(`/api/contacts`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Lond' })
        .set('Accept', 'application/json')

      expect(res.status).toEqual(400)
      expect(res.body).toBeDefined()
      done()
    })
    it('should return 400 status without required field email', async done => {
      const res = await request(app)
        .post(`/api/contacts`)
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'Lond@gmail.com' })
        .set('Accept', 'application/json')

      expect(res.status).toEqual(400)
      expect(res.body).toBeDefined()
      done()
    })
    it('should return 400 status without required field phone', async done => {
      const res = await request(app)
        .post(`/api/contacts`)
        .set('Authorization', `Bearer ${token}`)
        .send({ number: '9090303209' })
        .set('Accept', 'application/json')

      expect(res.status).toEqual(400)
      expect(res.body).toBeDefined()
      done()
    })
  })
  describe('should handle patch request', () => {
    it('should return 200 status update contact', async done => {
      const res = await request(app)
        .patch(`/api/contacts/${idNewContact}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Iron' })
        .set('Accept', 'application/json')

      expect(res.status).toEqual(200)
      expect(res.body).toBeDefined()
      expect(res.body.data.contact.name).toBe('Iron')
      done()
    })
    it('should return 400 status for wrong field', async done => {
      const res = await request(app)
        .patch(`/api/contacts/${idNewContact}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ test: 1 })
        .set('Accept', 'application/json')

      expect(res.status).toEqual(400)
      expect(res.body).toBeDefined()
      done()
    })
    it('should return 404 status with wrong id', async done => {
      const res = await request(app)
        .patch(`/api/contacts/3223`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Lond' })
        .set('Accept', 'application/json')

      expect(res.status).toEqual(404)
      expect(res.body).toBeDefined()
      done()
    })
  })
  describe('should handle delete request', () => {
    it('should return 200 status after delete contact', async done => {
      const res = await request(app)
        .delete(`/api/contacts/${idNewContact}`)
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toEqual(200)
      expect(res.body).toBeDefined()
      done()
    })
    it('should return 404 status with wrong id', async done => {
      const res = await request(app)
        .delete(`/api/contacts/3223`)
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toEqual(404)
      expect(res.body).toBeDefined()
      done()
    })
    it('should return 401 status for wrong token', async done => {
      const res = await request(app)
        .delete(`/api/contacts/${idNewContact}`)
        .set('Authorization', `Bearer 32323`)

      expect(res.status).toEqual(401)
      expect(res.body).toBeDefined()
      done()
    })
  })
})
