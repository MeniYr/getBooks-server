const mongoose = require("mongoose");
const { config } = require("../secret");

  mongoose.connect(`mongodb+srv://${config.userMongo}:${config.passMongo}@cluster0.oesax.mongodb.net/get_book`,{useNewUrlParser: true, useUnifiedTopology: true})

 const db = mongoose.connection;
 db.on('error', console.error.bind(console, 'connection error:'));
 db.once('open', ()  => {
  console.log("server connected to get_book db");
});


module.exports = db