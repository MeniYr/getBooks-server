const {
  BooksSchema,
  validateBook,
  BooksModel,
} = require("../models/booksSchema");

exports.getBooks = async (req, res) => {
  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;
  let cat = req.params.catId;

  try {
    let findFilter = {};
    if (cat) findFilter = { cat_id: cat };

    let books = await BooksModel.find(findFilter)
      .populate({ path: "cat_id" })
      .populate({ path: "userID" })
      .populate({
        path: "comments",
        populate: {
          path: "fromUser",
          select: "name",
        },
      })
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ created_at: -1 });
    res.status(200).json(books);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.getMyBooks = async (req, res) => {
  let user_id = req.tokenData._id;
  try {
    let books = await BooksModel.find({ userID: user_id })
      .populate({ path: "cat_id" })
      .populate({
        path: "comments",
        populate: {
          path: "fromUser",
          select: "name",
        },
      });
    //   console.log("getMyBooks", books);
    res.status(200).json(books);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.srchBooks = async (req, res) => {
  try {
    let regularEXP = new RegExp(req.body, "i");

    let resualt = await BooksModel.find({
      $or: [{ name: regularEXP }, { author: regularEXP }],
    })
      .populate({ path: "cat_id" })
      .populate({ path: "userID" })
      .populate({
        path: "comments",
        populate: {
          path: "fromUser",
          select: "name",
        },
      });
    res.status(200).json(resualt);
  } catch (err) {
    console.log("error srch => ", err);
    res.status(500).json(err);
  }
};

exports.addMsg = async (req, res) => {
  try {
    console.log("add msg book");
    let bookID = req.params.bookID;
    let fromUser = req.tokenData._id;

    req.body.fromUser = fromUser;
    let msg = await BooksModel.updateOne(
      { _id: bookID },
      { $push: { comments: req.body } }
    );
    res.status(200).json(msg);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.delMsg = async (req, res) => {
  try {
    let delId = req.params.idDel;

    let data = await UsersModel.updateOne(
      { _id: req.tokenData._id },
      { $pull: { msg: { _id: delId } } }
    );

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "server problem" });
  }
};

exports.addBook = async (req, res) => {
  try {
    let userID = req.tokenData._id;
    req.body.userID = userID;
    // console.log(req.body);
    let exist_on_user_books_lib = await BooksModel.findOne({
      $and: [
        { name: req.body.name },
        { author: req.body.author },
        { publishing_year: req.body.publishing_year },
      ],
    });
    if (exist_on_user_books_lib)
      return res.status(409).json("the same book is exist already on your lib");

    let checkValidate = validateBook(req.body);
    if (checkValidate.error) {
      console.log(checkValidate.error.details);
      return res.status(409).json(checkValidate.error.details);
    }

    let data = await BooksModel.create(req.body);
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.deleteBook = async (req, res) => {
  try {
    let idDel = req.params.idDel;

    let data = await BooksModel.deleteOne({ _id: idDel });

    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.swichHide = async (req, res) => {
  try {
    let bookId = req.params.bookId;
    let book = await BooksModel.findOne({ _id: bookId });
    let newBook;
    // console.log("book.hide", book.hide);
    if (book.hide === true)
      newBook = await BooksModel.updateOne(
        { _id: bookId },
        { $set: { hide: false } }
      );
    else
      newBook = await BooksModel.updateOne(
        { _id: bookId },
        { $set: { hide: true } }
      );
    res.json({ newBook });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "server problem" });
  }
};
exports.addRate = async (req, res) => {
  try {
    console.log(req.body.num);
    let bookId = req.params.bookID;

    let book = await BooksModel.findOne({ _id: bookId });

    if(book.rate){
          book.rate = Number((book.rate + req.body.num) / book.rateQuanity + 1)
    book.rateQuanity = Number(book.rateQuanity + 1)
    }
    else{
      book.rate = req.body.num
      book.rateQuanity = 1
    }


    console.log(book.rate);
    console.log(book.rateQuanity);

    await book.save();

    res.json({ book });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "server problem" });
  }
};

//TODO change rate
//TODO change favCount
//TODO addImage

//TODO middlewere search for isbn, after fill the name on client before
