const expressAsyncHandler = require("express-async-handler");
const Contact = require('../models/contactModel')

const allContacts = expressAsyncHandler(async (req, res) => {
    const contacts = await Contact.find({ user_id: req.user.id })
    res.status(200).json(contacts)
})

const createContact = expressAsyncHandler(async (req, res) => {
    const { name, email, phone } = req.body
    console.log(req.body)
    if (!name || !email || !phone) {
        res.status(400)
        throw new Error("all fields are mandatory")
    }
    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id: req.user.id
    })
    res.status(201).json(contact)
})

const getContact = expressAsyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id)
    if (!contact) {
        res.status(404)
        throw new Error("Contact not Found")
    }
    res.status(200).json(contact)
})

const updateContact = expressAsyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id)
    if (!contact) {
        res.status(404)
        throw new Error("Contact not Found")
    }
    // if (contact.user_id !== req.user.id) {
    //     res.status(401)
    //     throw new Error('You cannot update others contact')
    // }
    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    )
    res.status(201).json(updatedContact)
})

const deleteContact = expressAsyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id)
    if (!contact) {
        res.status(404)
        throw new Error("Contact not Found")
    }
    // if (contact.user_id !== req.user.id) {
    //     res.status(401)
    //     throw new Error('You cannot delete others contact')
    // }
    await Contact.deleteOne({ _id: req.params.id })
    res.status(200).json({ message: `delete the contact of ${req.params.id}` })
})

module.exports = {
    allContacts,
    createContact,
    getContact,
    updateContact,
    deleteContact
}