const { signUp_validate } = require("../models/usersSchema");

exports.signup_joi = (req, res, next) => {

    let validateSignUp = signUp_validate(req.body);

    if (signUp_validate(req.body).error) {

        console.log(validateSignUp.error.message)
        res.status(403).json(validateSignUp.error)

    }

    else {

        console.log("not ersor")
        next()
    }

    //     res.status(409).json(validateSignUp)



    // if (validateSignUp.error) {

    // }
    // else {
    // }
}