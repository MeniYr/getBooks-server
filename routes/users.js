const express = require("express");
const userControlle = require("../controllers/users");
const { auth, authAdmin } = require("../middleWares/auth");
const { signup_joi } = require("../middleWares/signUp_Joi");
const router = express.Router();




router.get("/", auth, userControlle.getUsers)
router.get("/userId/:idUser", auth, userControlle.getUser)
router.get("/userInfo", auth, userControlle.userInfo)
router.post("/signUp",signup_joi , userControlle.signUp)
router.post("/login", userControlle.logIn)
router.delete("/del/:idDel", userControlle.deleteUser)
router.put("/editUserInfo", auth, userControlle.editUserInfo)

// for admin update
router.put("/updateUser/:idEdit", authAdmin, userControlle.updateUser)
router.delete("/delUser/:idDel", authAdmin, userControlle.deleteUser)

router.post("/addMsg/:toUserID", auth, userControlle.addMsg)
router.post("/addBugMsg", auth,userControlle.addBugMsg)
router.post("/addNote/:idFromUser", auth,userControlle.addNotification)
router.put("/delMsg/:idDel", auth, userControlle.delMsg)
router.put("/readMsg/:idMsg", auth,userControlle.readMsg)
router.put("/readMsg/:idNote", auth,userControlle.readNote)
router.put("/readBugMsg/:idBugMsg", auth,userControlle.readBugMsg)
router.put("/favs/:favBookID", auth,userControlle.favs)
router.get("/checkToken", auth, userControlle.checkToken)

module.exports = router;