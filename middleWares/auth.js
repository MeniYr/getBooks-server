const jwt = require("jsonwebtoken");
const { config } = require("../secret");

exports.auth = async (req, res, next) => {
    console.log("here in auth");
    let token = req.header("x-api-key")
    console.log("auth token: ",token)
    if (!token) return res.status(401).json({ msg: "tokan required" })
    try {
    
        let decodeToken = jwt.verify(token,config.tokenSecret)
        req.tokenData = decodeToken;
        next()
    } catch (err) {
        return res.status(403).json({ msg: "Token invalid or expired" });
    }
}
exports.authAdmin = async (req, res, next) => {

    let token = req.header("x-api-key")
    if (!token) return res.status(401).json({ msg: "tokan required" })
    try {
        let decodeToken = jwt.verify(token, config.tokenSecret)
        if (decodeToken.role == "admin") {
            console.log(decodeToken.role)
            req.tokenData = decodeToken;
            next()
        }
        else
        return res.status(403).json({ msg: "You need to send token of admin to be here" });

    } catch (err) {
        console.error(err)
        return res.status(401).json({ msg: "Token invalid or expired" });
    }
}




