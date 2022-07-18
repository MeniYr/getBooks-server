const mongoose = require("mongoose");

const createSchema = new mongoose.Schema({
    name: String,
    Short_Id: BigInt,
})

exports.CategoriesModel = mongoose.model("categories", createSchema);