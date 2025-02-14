const fs = require('fs');

function logReqRes(filename) {
    return (req, res, next) => {
        let date_time = new Date();
        fs.appendFile('log.txt', `${date_time}: ${req.method}: ${req.path}\n`, (error, data) => {
        next();
    })
    }
};

module.exports = {
    logReqRes,
}