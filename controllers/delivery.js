const { deliveryModel, validatedelivery, validateDelivery } = require("../models/deliverySchema")

exports.getAll = async (req, res) => {
    try {
        let delivers = await deliveryModel.find()
        res.status(200).json(delivers)
    }
    catch (err) {
        res.status(500).json(err)
    }
}

exports.create = async (req, res) => {
    try {
        let deliver = await deliveryModel.create(req.body)
        res.status(200).json(deliver)
    }
    catch (err) {
        res.status(500).json(err)
    }
}

//deliver when user sign on form to publish or user press on button publish on a book,
// seen`s then delivery doas not removed until the book is removed from the site 