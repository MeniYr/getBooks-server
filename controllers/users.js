const { UsersModel, signUp_validate, signIn_validate, genToken, edit_validate } = require("../models/usersSchema");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");


exports.getUsers = async (req, res) => {
    try {
        res.json(await UsersModel.find({}, { password: 0 }))
    } catch (err) {
        console.error(err.message);
    }
}

exports.checkToken = async (req, res) => {
    return res.json({ status: "ok", role: req.tokenData.role })
}

exports.userInfo = async (req, res) => {
    try {
        res.json(await UsersModel.find({ _id: req.tokenData._id }, { password: 0 }))
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ msg: "server problem" })
    }
}

exports.editUserInfo = async (req, res) => {
    try {
        res.json(await UsersModel.updateOne({ _id: req.tokenData._id }, req.body))
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ msg: "server problem" })
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
        let savedPicName = "/62d8f4afa97d18c96a328dca" + path.extname(file.name);

        file.mv("profilePic" + savedPicName, async function (err) {
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

    try {
        let loginValidation = signIn_validate(req.body);
        if (loginValidation.error) {
            console.error(loginValidation.error)
            return res.status(401).json({ err_msg: "user / password not valid" })
        }

        let theMailExist = await UsersModel.findOne({ email: req.body.email });
        let theNameExist = await UsersModel.findOne({ name: req.body.name });
        let user = theMailExist ? theMailExist : theNameExist;
        const thePassExist = bcrypt.compare(req.body.password, user.password);

        if (!(user && thePassExist))
            return res.json({ msg: "wrong user or password" })

        let ticket = genToken(user._id, user.role)
        res.json({ ticket, user: { name: user.name, role: user.role } })
    }
    catch (e) {
        console.error(e);
    }

}

exports.updateUser = async (req, res) => {

    let dataValidate = edit_validate(req.body)
    if (dataValidate.error) {
        console.log(dataValidate.error.message)
        return res.status(400).json({ msg: "fildes not valid" })
    }

    try {
        let idEdit = req.params.idEdit;
        let data = await UsersModel.updateOne({ _id: idEdit }, req.body)

        res.status(200).json(data);
    }
    catch (err) {
        if (err.code === 11000) {
            return res.status(500).json({ err_msg: "Email already in system", code: 11000 })
        }
        res.status(500).json({ err_msg: "There is probelm , try again later" })

    }


}

exports.addMsg = async (req, res) => {
    try {
        //TODO add msg thruth json whith property msg
        req.body.userId = req.tokenData._id;
        // let date = new Date()
        req.body.date = new Date()
        // req.body.date = date.getDay()
        console.log(req.body)

        let data = await UsersModel.updateOne({ _id: req.tokenData._id }, { $push: { msg: req.body } })


        res.status(200).json(data)
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "server problem" })

    }
}




