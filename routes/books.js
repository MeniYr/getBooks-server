const express = require("express");
const booksControle = require("../controllers/books");
const { auth } = require("../middleWares/auth");
const router = express.Router();

router.get("/",booksControle.getBooks)
router.post("/add",auth,booksControle.addBook)
router.post("/srch/:srch_word",auth,booksControle.srchBooks)
module.exports = router;