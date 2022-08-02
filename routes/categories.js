const express = require("express");
const catControlle = require ("../controllers/categories");
const { authAdmin } = require("../middleWares/auth");
const router = express.Router();

router.get("/", catControlle.getCategories)
router.post("/add",authAdmin,catControlle.addCategories )
router.get("/srch/:idSrch",catControlle.srchCategories )
router.delete("/del/:idDel",authAdmin,catControlle.delCategory )



module.exports = router;