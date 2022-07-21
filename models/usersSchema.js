const mongoose = require("mongoose");
const joi = require("joi");
const jwt = require("jsonwebtoken");

const createSchema = new mongoose.Schema({
    name: String,
    email: String,
    isShareMail: {
        type: Boolean,
        default: false,
    },
    password: String,
    address: String,
    date_of_birth: String,
    phone: String,
    isSharePhone: {
        type: Boolean,
        default: false,
    },
    books_List: [],
    whish_List: [],
    msg: [{
        userId: String,
        name: String,
        date: {
            type: Date,
            default: Date.now()
        },
        msg: String,
        isRead: {
            type: Boolean,
            default: false
        },
    }],
    string_users_Bugs: [{
        userId: String,
        date: {
            type: Date,
            default: Date.now(),
        },
        msg: String,
    }],
    string_System_Bugs: [{
        date: {
            type: Date,
            default: Date.now(),
        },
        msg: String,
    }],
    log_in: {
        type: Date,
        default: Date.now(),
    },
    log_out: {
        type: Date,
        default: Date.now(),
    },
    connectingLog: [[]],
    delivary_count: Number,
    image: String,
    role: {
        type: String,
        default: "user",
    },
    join_date: {
        type: Date,
        default: Date.now(),
    },
})
exports.UsersModel = mongoose.model("users", createSchema);

exports.genToken = (_id, _role) => {
    const token = jwt.sign({ _id, _role }, "meni", { expiresIn: "60mins" })
    return token;
}

exports.signUp_validate = (req_body) => {
    let joiValidate = joi.object({
        name: joi.string().min(1).required(),
        email: joi.string().min(6).max(100).email().required(),
        address: joi.string().min(5).max(100).required(),
        password: joi.string().min(8).max(100).required(),
        phone: joi.string().min(10).allow("", null),
        isShareMail: joi.boolean().required(),
        isSharePhone: joi.boolean().required()
    })
    return joiValidate.validate(req_body);
}

exports.signIn_validate = (req_body) => {
    let joiValidate2 = joi.object({
        email: joi.string().min(6).max(100),
        password: joi.string().min(3).max(100).required()
    });
    return joiValidate2.validate(req_body);

}








