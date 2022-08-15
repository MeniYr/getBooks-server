const { default: mongoose } = require("mongoose")
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

// exports.srch = async (req, res) => {

//     try {

//         let regularEXP = new RegExp(req.body, "i")

//         let resualt = await deliveryModel.find()
//         .populate(
//             {path: "bookID"}
//         )
//         .populate(
//             {path: "ownerID"}
//         )
//         .populate(
//             {path: "interestedUsersID"}
//         )
//         res.status(200).json(resualt)

//     } catch (err) {
//         console.log("error srch => ", err);
//         res.status(500).json(err)
//     }
// }

exports.create = async (req, res) => {
    try {
        let newDelivery = await deliveryModel.create(req.body)
        // let updateNewInterested = await UsersModel.updateOne({ _id: req.tokenData._id }, { $push: { interestedUsersID: req.body.userID } })

        // res.status(200).json(newDelivery, updateNewInterested)
        res.status(200).json(newDelivery)
    }
    catch (err) {
        res.status(500).json(err)
    }
}

exports.addInerested = async (req, res) => {
    try {
        //         let isDeliveryExist = await deliveryModel.findOne({interestedUsersID:req.params.userID})
        // if (isDeliveryExist){
        let data = await UsersModel.updateOne({ _id: req.tokenData._id }, { $push: { interestedUsersID: req.params.userID } })
        if (data.matchedCount == 0)
            res.status(400).json("not exist", data)
        if (data.modifiedCount == 0)
            res.status(400).json("not change", data)

        res.status(200).json(data)

    }
    catch (err) {
    res.status(500).json(err)
}
}

exports.removeInerested = async (req, res) => {
    let delId = req.params.delID;
    try {
        let data = await UsersModel.updateOne({ _id: req.tokenData._id }, { $pull: { interestedUsersID: { _id: delId } } })
        res.status(200).json(data)
    }
    catch (err) {
        res.status(500).json(err)
    }
}

exports.deleteDelevery = async (req, res) => {
    let delId = req.params.delID;
    try {
        let data = await UsersModel.deleteOne({ _id: delId })
        res.status(200).json(data)
    }
    catch (err) {
        res.status(500).json(err)
    }
}

//deliver when user sign on form to publish or user press on button publish on a book,
// seen`s then delivery doas not removed until the book is removed from the site 