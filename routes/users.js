const express = require("express");
const router = express.Router();

router.get("/", (req,res)=>{
    res.json({msg:"users work!"})
})
module.exports = router;