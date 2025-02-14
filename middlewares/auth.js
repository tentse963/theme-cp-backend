const jwt = require('jsonwebtoken');

function authenticate (req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    // const token = req.cookies.token;
    if (token === 'undefined') {
        return res.sendStatus(401);
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            return res.json({message:'Token expired'});
        }
        req.user = user;
        next();
    });
};

module.exports = {
    authenticate,
}