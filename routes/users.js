const express = require("express");
const { UsersModel } = require("../models/usersSchema");
const router = express.Router();

router.get("/", (req,res)=>{
    let user = new UsersModel();
    // res.json({msg:user.get })
    
})


module.exports = router;