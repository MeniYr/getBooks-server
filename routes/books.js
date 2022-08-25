const express = require("express");
const booksControle = require("../controllers/books");
const { auth } = require("../middleWares/auth");
const router = express.Router();

router.get("/",booksControle.getBooks)
router.get("/myBooks",booksControle.getMyBooks)
router.post("/add",auth,booksControle.addBook)
router.patch("/delBook/:bookID",auth,booksControle.deleteBook)
router.post("/srch",booksControle.srchBooks)
router.patch("/addMsg/:bookID",auth,booksControle.addMsg)
router.patch("/deldMsg/:idDel",auth,booksControle.delMsg)
router.patch("/swichHide/:bookId",auth,booksControle.swichHide)
module.exports = router;