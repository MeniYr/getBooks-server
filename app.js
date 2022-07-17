const express = require("express");
const path = require("path");
const http = require("http");
const { routesInit, corsAccessControl } = require("./routes/config_routes");
const app = express();


app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

corsAccessControl(app)
routesInit(app);

require("./db/mongooseConnect")

const server = http.createServer(app);
let port = process.env.PORT || "3000";
server.listen(port);

const mongooseConnect = async () => {
   mongoose.connect("mongodb://localhost:3000/get_book", () => console.log("mongo is connect"));
}
mongooseConnect;
