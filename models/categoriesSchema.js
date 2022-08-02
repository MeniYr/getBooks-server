const mongoose = require("mongoose");
const joi = require("joi");

const createSchema = new mongoose.Schema({
    category: String,
})

exports.categoriesModel = mongoose.model("categories", createSchema);

exports.validateCat = (_reqBody) => {
    const catVal = joi.object({
        category: joi.string().min(1).max(20).required(),

    })
    return catVal.validate(_reqBody);
}


