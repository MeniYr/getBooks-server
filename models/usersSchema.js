const mongoose = require("mongoose");
const joi = require("joi");
const jwt = require("jsonwebtoken");

const createSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
    },
    isShareMail: {
        type: Boolean,
        default: false,
    },
    password: String,
    city: String,
    street: String,
    date_of_birth: String,
    phone: {
        type: String,
    },
    isSharePhone: {
        type: Boolean,
        default: false,
    },
    books_List: [],
    notifications: [{
        fromUserId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "users"
        },
        date: Date,
        bookID: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "books"
        },
        isRead: Boolean,
    }],
    whish_List: [],
    msg: [{
        fromUserId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "users"
        },
        name: String,
        date: {
            type: Date,
            default: Date.now
        },
        msg: String,
        isRead: {
            // default: false,
            type: Boolean
        },
    }],
    string_users_Bugs: [{
        userId: String,
        isRead: Boolean,
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

exports.genToken = (_id, role) => {
    const token = jwt.sign({ _id, role }, "meni", { expiresIn: "720mins" })
    return token;
}

exports.signUp_validate = (req_body) => {

    let joiValidate = joi.object({
        name: joi.string().min(1).required(),
        email: joi.string().min(6).max(100).email().required(),
        city: joi.string().min(2).max(20).required(),
        street: joi.string().min(2).max(20).required(),
        password: joi.string().min(3).max(100).required(),
        phone: joi.string().min(8)
        ,
        isShareMail: joi.boolean().allow(null),
        isSharePhone: joi.boolean().allow(null)
    })
    return joiValidate.validate(req_body);
}

exports.signIn_validate = (req_body) => {
    let joiValidateS = joi.object({
        email: joi.string().min(6).max(100),
        password: joi.string().min(3).max(100).required()
    });
    return joiValidateS.validate(req_body);

}


exports.edit_validate = (req_body) => {
    let joiValidateE = joi.object({
        name: joi.string().min(1).required(),
        email: joi.string().min(6).max(100).email().required(),
        city: joi.string().min(2).max(20).required(),
        street: joi.string().min(2).max(20).required(),
        password: joi.string().min(8).max(100).required(),
        phone: joi.string().min(10).allow("", null),
        isShareMail: joi.boolean().required(),
        isSharePhone: joi.boolean().required()
    })
    return joiValidateE.validate(req_body);
}





