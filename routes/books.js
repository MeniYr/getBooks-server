const express = require("express");
const router = express.Router();

router.get("/", (req,res)=>{
    res.json({msg:"book work!"})
})
module.exports = router;