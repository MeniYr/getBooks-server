const express = require("express");
const path = require("path");
const http = require("http");
const { routesInit, corsAccessControl } = require("./config_routes");
const { default: mongoose } = require("mongoose");
const app = express();
const fileUpload = require('express-fileupload');

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload({
   limits:1024 * 1024 *5
}));


corsAccessControl(app)
routesInit(app);

require("./db/mongooseConnect")

const server = http.createServer(app);
let port = process.env.PORT || "3000";
server.listen(port);

//mongodb initial connection
// const mongooseConnect = async () => {
//   try{
//      mongoose.connect("mongodb://localhost:27017/get_book", console.log("mongo is connect"));

//   }catch(err){console.log(err)};
// }
// mongooseConnect();
