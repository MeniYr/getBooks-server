const express = require("express");
const path = require("path");
const http = require("http");
const { routesInit, corsAccessControl } = require("./config_routes");
const { default: mongoose } = require("mongoose");
const app = express();
const fileUpload = require('express-fileupload');
const { rawListeners } = require("process");
const { EventEmitter } = require("stream");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload({
   limits: 1024 * 1024 * 5
}));

const whenThereIsMemmoryProblem = () => {
   const emitter = new EventEmitter();
   //emitter.setMaxListeners(100)//increace the limit of requests
   //emitter.setMaxListeners(0)//turn off the limit
}

// whenThereIsMemmoryProblem()


corsAccessControl(app)
routesInit(app);

require("./db/mongooseConnect")

const server = http.createServer(app);
let port = process.env.PORT || "3000";
server.listen(port);

