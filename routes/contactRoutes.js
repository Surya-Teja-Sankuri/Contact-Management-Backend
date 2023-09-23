const express = require('express')
const { allContacts, createContact, getContact, updateContact, deleteContact } = require('../controllers/contactController')
const validateToken = require('../middleware/validateToken')

const router = express.Router()

router.use(validateToken)
router.get('/', allContacts).post('/', createContact)
router.get('/:id', getContact).put('/:id', updateContact).delete('/:id', deleteContact)

module.exports = router