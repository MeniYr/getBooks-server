const express = require("express");//שימוש בספרית אקספרס
const path = require("path"); //מודול שיודע לעשות מניפולציות על כתובות
const http = require("http");
const {routesInit, corsAccessControl} = require("./routes/config_routes");
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));

corsAccessControl(app)//מאפשר לדפדפן לבצע בקשה מכל דומיין לשרת שלנו
routesInit(app);

// app.use("/",(req,res)=>{
//     res.json({msg:"express work!"})
// })

const server = http.createServer(app);
let port = process.env.PORT || "3000";
server.listen(port);