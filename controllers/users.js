const { UsersModel, signUp_validate, signIn_validate } = require("../models/usersSchema");
const bcript = require("bcrypt");
const multer = require("multer");
const path = require("path");

exports.getUsers = async (req, res) => {
    try {
        res.json(await UsersModel.find())
    } catch (err) {
        console.error(err.message);
    }
}

exports.signUp = async (req, res) => {
    try {
        let validateSignUp = signUp_validate(req.body);
        if (validateSignUp.error)
            return res.status(409).json(validateSignUp.error.message)

        let user = await UsersModel.create(req.body)
        await user.save()
        user.password = await bcript.hash(req.body.password, 10)
        user.password = "********"
        res.status(201).json(user)

    } catch (e) {
        if (e.code == 11000)
            return res.status(400).json({ code: 11000, err_msg: "email already in system try agein" })
        console.statos(500).error(e);
    }

}
//upload user profile image
exports.imgUpload = async (req, res) => {
    try {
        let file = req.files.myFile;
        if (file.size > (5 * 1024 * 1024))
            return res.status(400).json({ msg: "the file  is too big, please upload max 5 mb" })

        const exts_ar = [".jpg", ".JPG", ".jpeg", ".png", ".gif", ".svg", "..jfif"]
        if (!exts_ar.includes(path.extname(file.name)))
            return res.status(400).json({ msg: "please send image file only with the type`s jpg or png" })

        // let savedPicName = "/users_img/" + req.params.idUser + path.extname(file.name);
        let savedPicName = "/users_img/" + "62d8f4afa97d18c96a328dca" + path.extname(file.name);

        file.mv("C:\HTML\getsBooks_project\server\users_img", async function (err) {
            if (err) {
                console.error(err)
                return res.status(400).json({ msg: "picture are not valid" });
            }

        //let data = await UsersModel.updateOne({ _id: req.params.idUser, user_id: req.tokenData._id }, { image: savedPicName })
        let data = await UsersModel.updateOne({ _id: "62d8f4afa97d18c96a328dca" }, { image: savedPicName })

            res.json({ msg: "file upload", data })
        })
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: "server problem" })
        }


    }


exports.logIn = async (req, res) => {
        let theMailExist = (await UsersModel.find({ email: { $eq: req.body.email } })).length > 0;
        try {
            console.log(theMailExist)
            if (theMailExist) { res.status(409).json(theMailExist) }
            else {
                let user = await UsersModel.create(req.body)
                await user.save()
                user.password = await bcript.hash(req.body.password, 10)
                user.password = "********"
                res.json({ user })
            }
        } catch (e) {
            console.error(e);
        }

    }





// module.exports = {
//     signUp,
//     logIn
// }


