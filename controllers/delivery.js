const { default: mongoose } = require("mongoose");
const {
  deliveryModel,
  validatedelivery,
  validateDelivery,
} = require("../models/deliverySchema");

const {
  BooksSchema,
  validateBook,
  BooksModel,
} = require("../models/booksSchema");
const { UsersModel } = require("../models/usersSchema");

exports.getAll = async (req, res) => {
  try {
    console.log("delivery 17");
    let delivers = await deliveryModel.find();
    console.log("deliveries 19", delivers);
    res.json(delivers);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.create = async (req, res) => {
  try {
    let newDelivery = await deliveryModel.create(req.body);
    // let updateNewInterested = await UsersModel.updateOne({ _id: req.tokenData._id }, { $push: { interestedUsersID: req.body.userID } })

    // res.status(200).json(newDelivery, updateNewInterested)
    res.status(200).json(newDelivery);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.addInerested = async (req, res) => {
  console.log("addInerested bookId =>", req.params.bookID);

  try {
    let exist = await deliveryModel.findOne({
      $and: [
        { bookID: req.params.bookID },
        { interestedUsersID: req.tokenData._id },
      ],
    });
    if (exist) {
      let data = await deliveryModel.updateOne(
        { bookID: req.params.bookID },
        { $pull: { interestedUsersID: { $in: [req.tokenData._id] } } }
      );
      console.log(data);
      return res.json(data);
    } else {
      let data = await deliveryModel.updateOne(
        { bookID: req.params.bookID },
        { $push: { interestedUsersID: req.tokenData._id } }
      );
      console.log(data);
      if (data.matchedCount !== 1) return res.status(400).json(data);

      res.json(data);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.complateDelivery = async (req, res) => {
  try {
    let idBook = req.params.idBook;
    const preBook = await BooksModel.findOne({ _id: idBook });
    const preDeliver = await deliveryModel.findOne({ bookID: idBook });

    let book = await BooksModel.updateOne(
      { _id: preBook._id },
      { userID: preDeliver.userToDeliverID, hide: false }
    );

    // change owner on deliver object
    let changeOwner = await deliveryModel.updateOne(
      { bookID: preBook._id },
      { ownerID: preDeliver.userToDeliverID, interestedUsersID: [] }
    );

    let toUser = await UsersModel.findOne({
      _id: preDeliver.userToDeliverID,
    });

    let notifications = toUser.notifications;
    
    let notify = {
      fromUserId: req.tokenData._id,
      date: new Date(),
      bookID: preBook._id,
      isForDeliver:true,
      isRead: false,
    }

    notifications.push(notify)

    let notifyToUser = await UsersModel.updateOne({ _id: preDeliver.userToDeliverID }, { notifications });



    res.json({ changeOwner, book, notifyToUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "server problem" });
  }
};

// timer to reduce owner if not deliverd for 1 week

// exports.reduceToOpen = async (req, res) => {
//   let bookId = req.body.bookId;
//   let userId = req.body.userId;
//   try {
//     let notChangeDelivery = await deliveryModel.findOne(
//       { bookID: bookId },
//       { ownerID: userId }
//     );
//     if (notChangeDelivery) {
//       let resetInterested = await deliveryModel.updateOne(
//         { bookID: bookId },
//         { interestedUsersID: [] }
//         );
//         let book = await BooksModel.updateOne({ _id: bookId }, { hide: false });
//     }

//     // change owner on deliver object

//     res.json({ changeUser, book });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "server problem" });
//   }
// };

exports.changeUserToDeliverID = async (req, res) => {
  console.log("changeUserToDeliverID:", req.body);

  try {
    let idBook = req.body.idBook;
    let idToChange = req.body.idUser;

    let changeUser = await deliveryModel.updateOne(
      { bookID: idBook },
      { userToDeliverID: idToChange }
    );
    console.log(changeUser);
    res.json({ changeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "server problem" });
  }
};

exports.reduceBookToDeliverable = async (req, res) => {
  console.log(req);
  res.json({ msg: "reduceBookToDeliverable" });
};

exports.deleteDelevery = async (req, res) => {
  let delId = req.params.delID;
  try {
    let data = await UsersModel.deleteOne({ _id: delId });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
};

//deliver when user sign on form to publish or user press on button publish on a book,
// seen`s then delivery doas not removed until the book is removed from the site
