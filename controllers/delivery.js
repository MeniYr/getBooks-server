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
    console.log("book_ID=>", req.params.bookID);

    try {
        let exist = await deliveryModel.findOne({ $and: [{ bookID: req.params.bookID }, { interestedUsersID: req.tokenData._id }] })
        if (exist) {
            let data = await deliveryModel.updateOne({ bookID: req.params.bookID }, { $pull: { interestedUsersID: { $in: [req.tokenData._id] } } })
            console.log(data);
            return res.json(data)
        }
        else {
            let data = await deliveryModel.updateOne({ bookID: req.params.bookID }, { $push: { interestedUsersID: req.tokenData._id } })
            if (data.matchedCount == 0)
                return res.status(400).json(data)
            if (data.modifiedCount == 0)
                return res.status(400).json(data)

            res.json(data)
        }


    }
    catch (err) {
        res.status(500).json(err)
    }
}

// exports.removeInerested = async (req, res) => {
//     let book_ID = req.params.bookID;
//     console.log("book_ID=>", book_ID);
//     try {


//         let data = await deliveryModel.updateOne({ bookID: book_ID }, { $pull: { interestedUsersID: { $in: [req.tokenData._id] } } })

//         res.status(200).json(data)
//     }
//     catch (err) {
//         res.status(500).json(err)
//     }
// }

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