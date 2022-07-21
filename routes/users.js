const express = require("express");
const userControlle = require("../controllers/users");
const router = express.Router();




router.get("/",userControlle.getUsers)
router.post("/signUp",userControlle.signUp)
router.post("/imgUpload",userControlle.imgUpload)


module.exports = router;