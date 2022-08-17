const mongoose = require("mongoose");
const joi = require("joi");

const createSchema = new mongoose.Schema({
    name: String,
    author: String,
    publishing_year:String,
    pages: Number,
    description: String,
    image: String,
    userID:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "users"
    },
    cat_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "categories"
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    hide: Boolean,
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

exports.BooksModel = mongoose.model("books", createSchema);

exports.validateBook = (_reqBody) => {
    const bookVal = joi.object({
        name: joi.string().min(1).max(100).required(),
        author: joi.string().min(1).max(20).required(),
        publishing_year: joi.string().min(1).max(4).allow("",null),
        description: joi.string().min(5).max(5000).allow("",null),
        comments: joi.string().allow("",null),
        pages: joi.number().allow("",null),
        cat_id: joi.string(),
        image: joi.string(),
        hide:joi.boolean(),
        userID: joi.string()
    })
    return bookVal.validate(_reqBody);
}


