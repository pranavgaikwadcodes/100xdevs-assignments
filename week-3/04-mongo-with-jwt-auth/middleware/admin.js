const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require("../config");

// Middleware for handling auth
function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected

    const token = req.headers.authorization;
    const splitToken = token.split(" ");
    const jwtToken = splitToken[1];

    const tokenVerification = jwt.verify(jwtToken, JWT_SECRET);
    if (tokenVerification.username) {
        next();
    } else{
        res.status(401).send({ message: "Unauthorized" });
    }
        


}

module.exports = adminMiddleware;