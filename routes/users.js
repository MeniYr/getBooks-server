const express = require("express");
const userControlle = require("../controllers/users");
const router = express.Router();




router.get("/",userControlle.getUsers)
router.post("/signUp",userControlle.signUp)
router.post("/login",userControlle.logIn)
router.post("/imgUpload",userControlle.imgUpload)
router.post("/checkToken",userControlle.checkToken)


module.exports = router;