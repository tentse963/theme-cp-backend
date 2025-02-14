const { user_data } = require('../models/postgres_connection');
const jwt = require('jsonwebtoken');

async function jwttoken(req,res) {
    const user = {
        name : req.user.displayName,
        email: req.user.emails[0]['value'],
    }
    const token = jwt.sign( {
        name: user.name,
        email: user.email,

    }, process.env.SECRET_KEY, {expiresIn: '1h'});
    const search_user = await user_data.findOne({ where: {email: user.email }});
    if (search_user === null) {
        const new_user = await user_data.create({name: user.name, email: user.email});
    }
    const db_user = await user_data.findOne({ where: {email: user.email }});
    return res.json({
        'message': 'user logged in successfull',
        db_user,
        token,
    });
    res.redirect('http://localhost:3000/dashboard?token=${token}'); // send token to frontend
}

module.exports = {
    jwttoken,
}