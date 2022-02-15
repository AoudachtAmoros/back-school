
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function authorization(req, res, next) {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer') || !req.headers.authorization.split(' ')[1]) {
        return res.status(403).json({
            message: "Please provide the token",
        });
    }
    const theToken = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(theToken, 'the-super-strong-secrect');
    console.log("decode middleware",decoded)
    if(decoded){
        next()
    }else{
        res.status(401).send({msg:'unauthorize'})
    }
};

module.exports.authorization = authorization
