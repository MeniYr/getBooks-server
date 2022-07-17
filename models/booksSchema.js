const mongoose = require("mongoose");

const createSchema = new mongoose.Schema({
    book_name: String,
    info: String,
    file: URL,
    date: Date,
    interested_user_id: [],
    Category_id: BigInt,
    created_at: Date,
    IsDeliverd: {
        type: Boolean,
        default: false
    },
    owner_id: BigInt,
    favoriteCount: BigInt,
    rate: Number,
    String_response: []
})

