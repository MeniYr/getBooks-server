const mongoose = require("mongoose");
const joi = require("joi");

const createSchema = new mongoose.Schema({

    bookID: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "books"
    },

    ownerID: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "users"
    },

    interestedUsersID: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "users"
    }],

    dilivered_count: Number,

    hide: Boolean,

    created_at: {
        type: Date,
        default: Date.now
    },

})

exports.deliveryModel = mongoose.model("delivery", createSchema);



