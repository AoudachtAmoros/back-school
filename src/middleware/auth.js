
const jwt = require('jsonwebtoken');
async function authorization(req, res, next) {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer') || !req.headers.authorization.split(' ')[1]) {
        console.log('## Invalid token form.');
        return res.status(403).json({
            message: "Please provide the token",
        });
    }
    try {
        const theToken = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(theToken, 'the-super-strong-secrect');
        console.log('## Valid token ---> next ...');
        next()
    } catch (error) {
        console.log('## Validation error ---> ', error);
        res.status(401).send({msg:'unauthorize'})
    }
};

module.exports.authorization = authorization
