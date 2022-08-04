const { BooksSchema, validateBook, BooksModel } = require("../models/booksSchema")

exports.getBooks = async (req, res) => {

    try {
        let books = await BooksModel.find({})
            .populate(
                { path: "cat_id" }
            )
            .populate(
                {
                    path: "comments",
                    populate: {
                        path: "fromUser",
                        select: "name"
                    }
                }
            )
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
        let resualt = await BooksModel.find({ $or: [{ name: regularEXP }, { author: regularEXP }] })
        res.status(200).json(resualt)

    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
}

exports.addMsg = async (req, res) => {
    try {

        let bookID = req.params.bookID;
        let fromUser = req.tokenData._id;

        req.body.fromUser = fromUser
        let msg = await BooksModel.updateOne({ _id: bookID }, { $push: { comments: req.body } })
        res.status(200).json(msg)

    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
}

exports.delMsg = async (req, res) => {
    try {
        let delId = req.params.idDel;

        let data = await UsersModel.updateOne({ _id: req.tokenData._id }, { $pull: { msg: { _id: delId } } })

        res.status(200).json(data)
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "server problem" })

    }
}

exports.addBook = async (req, res) => {
    try {
        // console.log(req.body);
        let exist_on_user_books_lib = await BooksModel.findOne({ $and: [{ name: req.body.name }, { author: req.body.author }, { publishing_year: req.body.publishing_year }] })
        if (exist_on_user_books_lib)
            return res.status(409).json("the same book is exist already on your lib")

        let checkValidate = validateBook(req.body)
        if (checkValidate.error) {
            console.log(checkValidate.error.details);
            return res.status(409).json(checkValidate.error.details)
        }

        let data = await BooksModel.create(req.body)
        res.status(200).json(data)

    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
}

exports.deleteBook = async (req, res) => {
    try {

        let idDel = req.params.idDel;

        let data = await BooksModel.deleteOne({ _id: idDel })

        res.status(200).json(data)

    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
}

//TODO change rate
//TODO change favCount
//TODO addImage

//TODO middlewere search for isbn, after fill the name on client before 