const mongoose = require("mongoose");
let hgjvf = {

}

const createSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    address: String,
    date_of_birth: Date,
    phone: String,
    books_List: [],
    whish_List: [],
    msg: [{
        userId: String,
        name: String,
        date: Date.now(),
        msg: String,
    }],
    string_users_Bugs: [{
        userId: String,
        date: Date.now(),
        msg: String,
    }],
    string_System_Bugs: [{
        date: Date.now(),
    }],
    log_in: Date.now(),
    log_out: Date.now(),
    connectingLog: [[]],
    delivary_count: BigInt,
    file: URL,
    user: {
        type: String,
        default: "user",
    },
    join_date: Date.now(),
})




