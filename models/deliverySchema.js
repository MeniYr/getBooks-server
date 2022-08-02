const mongoose = require("mongoose");
const joi = require("joi");

const createSchema = new mongoose.Schema({
   bookID: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "book"
    },
   ownerID: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "book"
    },
    interestedUsersID : [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "book"
    }],
    open_ticket: {
        type: Date,
        default: Date.now
    },
    close_ticket: {
        type: Date,
        default: Date.now
    },
 
   
    favoriteCount: Number,
    rate: Number,
    comments: [{
        fromUser: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "users"
        },
        date: {
            type: Date,
            default: Date.now
        },
        msg: String
    }]
})

exports.deliverySchema = mongoose.Model("delivery", createSchema);

exports.validatedelivery = (_reqBody) => {
    const deliveryVal = joi.object({
        name: joi.string().min(1).max(20).required(),
        author: joi.string().min(1).max(20).required(),
        publishing_year: joi.date().min(1).max(4).required(),
        description: joi.string().min(5).max(5000).allow(""),
        comments: joi.string()
    })
    return deliveryVal.validate(_reqBody);
}


