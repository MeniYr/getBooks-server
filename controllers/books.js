const { BooksSchema, validateBook } = require("../models/booksSchema")

exports.getBooks = async (req, res) => {

    try {
        let books = await BooksSchema.find({})
        res.status(200).json(books)
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
}

exports.srchBooks = async (req, res) => {
    let srch_word = req.params.srch_word;
    let regularEXP = new RegExp(srch_word, "i")

    try {
        let resualt = await BooksSchema.find({ $or: [{ name: regularEXP }, { author: regularEXP }] })
        res.status(200).json(resualt)

    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
}

exports.addBook = async (req, res) => {
    try {
        
        let exist_on_user_books_lib = await BooksSchema.findOne({ $and: [{ name: req.body.name }, { author: req.body.author }, { publishing_year: req.body.publishing_year }] })
        if (exist_on_user_books_lib)
            return res.status(409).json("the same book is exist already on your lib")

        let checkValidate = validateBook(req.body)
        if (checkValidate.error)
            return res.status(409).json(checkValidate.error.details)

        let data = await BooksSchema.create(req.body)
        res.status(200).json(data)

    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
}