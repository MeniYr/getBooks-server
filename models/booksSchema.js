const mongoose = require("mongoose");
const joi = require("joi");

const createSchema = new mongoose.Schema({
    book_name: String,
    info: String,
    file: URL,
    date: Date,
    interested_user_id: [],
    Category_id: String,
    created_at: {
     type: Date,
     default: Date.now()  
    },
    IsDeliverd: {
        type: Boolean,
        default: false
    },
    owner_id: String, 
    favoriteCount: BigInt,
    rate: Number,
    responses: []
})

exports.BooksSchema = mongoose.Model("book", createSchema);

exports.validateBook = (_reqBody) => {
    const bookVal = joi.object({
        book_name:joi.string().min(1).required(),
        info:joi.string().min(2).max(1500).allow(""),
    })
    return bookVal.validate(_reqBody);
}


