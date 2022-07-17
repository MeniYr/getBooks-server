const mongoose = require("mongoose");

const createSchema = new mongoose.Schema({
    name: String,
    Short_Id: BigInt,
})