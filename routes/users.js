const express = require("express");
const userControlle = require("../controllers/users");
const { auth, authAdmin } = require("../middleWares/auth");
const router = express.Router();




router.get("/",auth , userControlle.getUsers)
router.get("/userInfo", auth, userControlle.userInfo)
router.post("/signUp", userControlle.signUp)
router.post("/login", userControlle.logIn)
// for user update
router.put("/editUserInfo", auth, userControlle.userInfo)
// for admin update
router.put("/updateUser/:idEdit",authAdmin , userControlle.updateUser)

router.post("/imgUpload", userControlle.imgUpload)
router.post("/checkToken", auth,userControlle.checkToken)

module.exports = router;