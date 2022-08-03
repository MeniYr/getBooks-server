const mongoose = require("mongoose");
const joi = require("joi");

const createSchema = new mongoose.Schema({
    name: String,
    author: String,
    publishing_year:String,
    pages: Number,
    description: String,
    image: String,
    cat_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "categories"
    },
    created_at: {
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

exports.BooksSchema = mongoose.model("books", createSchema);

exports.validateBook = (_reqBody) => {
    const bookVal = joi.object({
        name: joi.string().min(1).max(20).required(),
        author: joi.string().min(1).max(20).required(),
        publishing_year: joi.string().min(1).max(4).required(),
        description: joi.string().min(5).max(5000).allow(""),
        comments: joi.string(),
        pages: joi.number(),
        cat_id: joi.string()
    })
    return bookVal.validate(_reqBody);
}


