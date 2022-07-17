const express = require("express");
const router = express.Router();

router.get("/", (req,res)=>{
    res.json({msg:"cat work!"})
})
module.exports = router;