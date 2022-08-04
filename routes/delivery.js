const deliveryControle = require("../controllers/delivery")
const express = require("express");
const { auth } = require("../middleWares/auth");
const router = express.Router();

router.get("/",deliveryControle.getAll)
router.post("/create",auth,deliveryControle.create)
module.exports = router;