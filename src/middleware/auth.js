<<<<<<< HEAD
//DH 

// required module
const jwt = require('jsonwebtoken')

// create a auth middleware here
=======
//DH

// required module
const jwt = require("jsonwebtoken");

// create a auth middleware here
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};
>>>>>>> 057bb624ddd72f8599f4ec7a31046456bf1fb363
