const {
  UsersModel,
  signUp_validate,
  signIn_validate,
  genToken,
  edit_validate,
} = require("../models/usersSchema");
const bcrypt = require("bcrypt");
const path = require("path");

// gets
exports.getUsers = async (req, res) => {
  try {
    let users = await UsersModel.find({}, { password: 0 })
      .populate({
        path: "notifications",
        populate: {
          path: "fromUserId",
        },
      })
      .populate({
        path: "notifications",
        populate: {
          path: "bookID",
        },
      });

    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "there is a server problem" }, err);
  }
};

exports.getUser = async (req, res) => {
  try {
    console.log("getUser => req.params: ", req.params.idUser);
    let user = await UsersModel.findOne(
      { _id: req.params.idUser },
      { password: 0 }
    )
      .populate({
        path: "notifications",
        populate: {
          path: "fromUserId",
        },
      })

      .populate({
        path: "notifications",
        populate: {
          path: "bookID",
        },
      });

    res.json(user);
  } catch (err) {
    console.error(err.message);
    return err.message;
  }
};

exports.userInfo = async (req, res) => {
  try {
    let user = await UsersModel.find(
      { _id: req.tokenData._id },
      { password: 0 }
    )
    // .sort({msg:0})
      .populate({
        path: "notifications",
        populate: {
          path: "fromUserId",
        },
      })
      .populate({
        path: "notifications",
        populate: {
          path: "bookID",
        },
      })
      .populate({
        path: "msg",
        populate: {
          path: "fromUserId",
        },
      });
      
    res.json(user[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "server problem" });
  }
};

// auth user
exports.signUp = async (req, res) => {
  let userVal = signUp_validate(req.body);
  if (userVal.error) return res.status(400).json(validUser.error.details);

  try {
    let user = await UsersModel.create(req.body);
    user.password = await bcrypt.hash(req.body.password, 10);
    // user.password = "********"
    await user.save();
    res.json({ user });
  } catch (e) {
    if (e.code == 11000) {
      return res
        .status(400)
        .json({ code: 11000, err_msg: "email already in system try agein" });
    }
    console.log(e);
    res.status(500).json(e);
  }
};

exports.logIn = async (req, res) => {
  try {
    let loginValidation = signIn_validate(req.body);
    if (loginValidation.error) {
      console.error(loginValidation.error);
      return res.status(401).json({ err_msg: "user / password not valid" });
    }

    let user = await UsersModel.findOne({ email: req.body.email });
    console.log(user);

    if (!user) return res.status(403).json({ msg: "wrong user or password" });

    const thePassExist = await bcrypt.compare(req.body.password, user.password);
    console.log(thePassExist, "body:", req.body.password, user.password);
    if (!thePassExist)
      return res.status(403).json({ msg: "wrong user or password" });

    let token = genToken(user._id, user.role);
    res.json({
      token,
      user: { name: user.name, role: user.role, userID: user._id },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "server problem" });
  }
};

exports.checkToken = async (req, res) => {
  res.json({ status: "ok", role: req.tokenData.role });
};

// updates
exports.editUserInfo = async (req, res) => {
  try {
    console.log(req.body);
    req.body.password = await bcrypt.hash(req.body.password, 10);
    let data = await UsersModel.updateOne({ _id: req.tokenData._id }, req.body);
    res.status(201).json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "server problem" });
  }
};

exports.updateUser = async (req, res) => {
  let dataValidate = edit_validate(req.body);
  if (dataValidate.error) {
    console.log(dataValidate.error.message);
    return res.status(400).json({ msg: "fildes not valid" });
  }

  try {
    let idEdit = req.params.idEdit;
    let data = await UsersModel.updateOne({ _id: idEdit }, req.body);

    res.status(200).json(data);
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(500)
        .json({ err_msg: "Email already in system", code: 11000 });
    }
    res.status(500).json({ err_msg: "There is probelm , try again later" });
  }
};

// adds
exports.addMsg = async (req, res) => {
  try {
    let fromUser = req.tokenData._id;
    let toUser = req.params.toUserID;

    req.body.fromUserId = fromUser;
    req.body.date = new Date();
    req.body.isRead = false;

    let data = await UsersModel.updateOne(
      { _id: toUser },
      { $push: { msg: req.body } }
    );

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "server problem" });
  }
};

exports.addNotification = async (req, res) => {
  try {
    let toUser = req.params.idToUser;

    // console.log("addNotification: toUser=>", toUser);
    let user = await UsersModel.findOne({
      _id: toUser,
    });
    let notifications = user.notifications;
    let exist = false;
    let notifySaved = null;
    for (let i = 0; i < notifications.length; i++) {
      if (
        notifications[i].fromUserId == req.body.fromUserId &&
        notifications[i].bookID == req.body.bookID
      ) {
        notifySaved = notifications[i];
        notifications = notifications.filter((item) =>
          item!=notifySaved
        );
        console.log("new notifications:", notifications);
        exist = true;
        break;
      }
    }
    if (!exist) {
      console.log("not exist = > ", exist);
      req.body.date = new Date();
      req.body.isRead = false;
      notifications.push(req.body);
      console.log("230", notifications);
    }

    let data = await UsersModel.updateOne({ _id: toUser }, { notifications });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "server problem" });
  }
};

exports.addBugMsg = async (req, res) => {
  try {
    req.body.userId = req.tokenData._id;
    (req.body.isRead = false), (req.body.date = new Date());

    let data = await UsersModel.updateOne(
      { _id: req.tokenData._id },
      { $push: { string_users_Bugs: req.body, date: Date.now } }
    );

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "server problem" });
  }
};

// deletes
exports.deleteUser = async (req, res) => {
  try {
    let idDel = req.params.idDel;
    let data = await UsersModel.deleteOne({ _id: idDel });

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ err_msg: "There is probelm , try again later" });
  }
};

exports.delMsg = async (req, res) => {
  try {
    let delId = req.params.idDel;

    let data = await UsersModel.updateOne(
      { _id: req.tokenData._id },
      { $pull: { msg: { _id: delId } } }
    );

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "server problem" });
  }
};

// reades
exports.readMsg = async (req, res) => {
  try {
    let idMsg = req.params.idMsg;
    let user = await UsersModel.updateOne(
      { _id: req.tokenData._id },
      { $set: { "msg.$[elem].isRead": true } },
      { arrayFilters: [{ "elem._id": idMsg }] }
    );
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "server problem" });
  }
};

exports.readNotify = async (req, res) => {
  try {
    let idNote = req.params.idNote;
    let user = await UsersModel.updateOne(
      { _id: req.tokenData._id },
      { $set: { "notifications.$[elem].isRead": true } },
      { arrayFilters: [{ "elem._id": idNote }] }
    );
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "server problem" });
  }
};

exports.readBugMsg = async (req, res) => {
  try {
    let idBugMsg = req.params.idBugMsg;
    let user = await UsersModel.updateOne(
      { _id: req.tokenData._id },
      { $set: { "string_users_Bugs.$[elem].isRead": true } },
      { arrayFilters: [{ "elem._id": idBugMsg }] }
    );
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "server problem" });
  }
};

exports.favs = async (req, res) => {
  try {
    let user = req.tokenData._id;
    let favBookID = req.params.favBookID;

    req.body.date = new Date();

    let data = await UsersModel.updateOne(
      { _id: user },
      { $push: { whish_List: favBookID } }
    );

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "server problem" });
  }
};
