const jwt = require("jsonwebtoken")

exports.auth = async (req, res, next) => {
    let token = req.header("x-api-key")
    if (!token) return res.status(401).json({ msg: "tokan required" })
    try {
    
        let decodeToken = jwt.verify(token, "meni")
        req.tokenData = decodeToken;
        next()
    } catch (err) {
        console.error(err)
        return res.status(403).json({ msg: "Token invalid or expired" });
    }
}
exports.authAdmin = async (req, res, next) => {

    let token = req.header("x-api-key")
    if (!token) return res.status(401).json({ msg: "tokan required" })
    try {
        let decodeToken = jwt.verify(token, "meni")
        if (decodeToken.role == "admin") {
            req.tokenData = decodeToken;
            next()
        }
        return res.status(403).json({ msg: "You need to send token of admin to be here" });

    } catch (err) {
        console.error(err)
        return res.status(401).json({ msg: "Token invalid or expired" });
    }
}




