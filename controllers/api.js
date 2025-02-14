const { user_data,user_contest,level_sheet } = require('../models/postgres_connection');
const jwt = require('jsonwebtoken');

// function performace(L3, K3, J3, I3, E3, F3, G3, H3, D3) {
//     // //console.log(`L3: ${L3}, K3: ${K3}, J3: ${J3}, I3: ${I3}, E3: ${E3}, F3: ${F3}, G3: ${G3}, H3: ${H3}, D3: ${D3}`);
//     let result;

//     if (L3 === null || L3 === "" || L3 === 0) {
//         if (K3 === null || K3 === "" || K3 === 0) {
//             if (J3 === null || J3 === "" || J3 === 0) {
//                 if (I3 === null || I3 === "" || I3 === 0) {
//                     result = E3 - 50;
//                 } else {
//                     result = (I3 / 135 * E3) + ((135 - I3) / 135 * F3);
//                 }
//             } else {
//                 result = (J3 / 135 * F3) + ((135 - J3) / 135 * G3);
//             }
//         } else {
//             result = (K3 / 135 * G3) + ((135 - K3) / 135 * H3);
//         }
//     } else {
//         result = (L3 / 120 * H3) + ((120 - L3) / 120 * (H3 + 400)) + ((D3 - 1) % 4) * 12.5;
//     }
//     return Math.round(result);
// }
function performace(D3, E3, F3, G3, H3, I3, J3, K3, L3) {
    // Helper functions
    function max(a, b) {
        return Math.max(a, b);
    }

    function min(a, b) {
        return Math.min(a, b);
    }

    function round(value) {
        return Math.round(value);
    }

    function isBlank(value) {
        return value === null || value === undefined || value === "";
    }

    // Calculate intermediate constants
    const calc1 = max(135, min(195, 135 + 2.5 * (D3 - 52)));
    const calc2 = max(120, min(180, 120 + 2.5 * (D3 - 52)));

    let result;

    if (isBlank(L3)) {
        if (isBlank(K3)) {
            if (isBlank(J3)) {
                if (isBlank(I3)) {
                    result = E3 - 50;
                } else {
                    result = (I3 / calc1) * E3 + ((calc1 - I3) / calc1) * F3;
                }
            } else {
                result = (J3 / calc1) * F3 + ((calc1 - J3) / calc1) * G3;
            }
        } else {
            result = (K3 / calc1) * G3 + ((calc1 - K3) / calc1) * H3;
        }
    } else {
        result =
            (L3 / calc2) * H3 +
            ((calc2 - L3) / calc2) * (H3 + 400) +
            ((D3 - 1) % 4) * 12.5;
    }

    return round(result);
}

async function rating(T1, performance, lastRating, handle) {
    let result;
    if (lastRating === null) {
        let data = await fetch(`https://codeforces.com/api/user.rating?handle=${handle}`)
                .then((res) => res.json());
        const number_of_contest = data['result'].length;
        if (number_of_contest === 0) {
            result = (performance / 15) + (1400 * 14 / 15);
        }
        else if (number_of_contest > 0 && number_of_contest <= 5 && (Number(data['result'][0].ratingUpdateTimeSeconds) * 1000) > 1591001600000) {
            const cf_user_rating = data['result'][number_of_contest - 1].newRating;
            const arr = [1400, 900, 550, 300, 150, 50];
            let startingRating = 0;
            if (number_of_contest <= 5) {
                startingRating = cf_user_rating + arr[number_of_contest];
            }
            const scale = Math.pow(0.75, number_of_contest);
            startingRating = startingRating * (1 / (1 - scale)) - 1400 * (1 / (1 - scale) - 1);
        
            result = (performance / 15) + (startingRating * 14 / 15);
        } else {
            const cf_user_rating = data['result'][number_of_contest - 1].newRating;
            result = (performance / 15) + (cf_user_rating * 14 / 15);
        }
    }
    else if (T1 === null) {
        result = Math.min(lastRating, ((performance / 15) + (lastRating * 14 / 15)));
    }
    else {
        result = (performance / 15) + (lastRating * 14 / 15);
    }
    return Math.round(result);
}

async function generateToken(req, res) {
    const data = req.body;
    const user = {
        name : data['name'],
        email : data['email'],
    }
    const token = jwt.sign( {
        name: user.name,
        email: user.email,
    }, process.env.SECRET_KEY, {expiresIn: '30d'});
    return res.json({token});
}

async function logout(req,res){
    let token = null;
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 0,
    });
    return res.sendStatus(200);
}

async function user_auth(req,res) {
    return res.sendStatus(200);
}

async function add_user(req, res) {
    const user = {
        name : req.user.name,
        email : req.user.email,
    }
    const search_user = await user_data.findOne({where: {email: user.email}});
    if (search_user === null) {
        await user_data.create({
            name : user.name,
            email : user.email,
        });
    }
    res.sendStatus(200);
}

async function user_profile(req, res) {
    const user = {
        name : req.user.name,
        email : req.user.email,
    };
    const search_user = await user_data.findOne({ where: {email: user.email}});
    if (search_user === null) {
        res.json({message: "server error"});
    }
    const response = {
        "name" : search_user['dataValues']['name'],
        "email" : search_user['dataValues']['email'],
        "codeforces_handle" : search_user['dataValues']['codeforces_username'],
    }
    res.send(response);
}

async function addHandle(req, res) {
    const user = {
        name : req.user.name,
        email : req.user.email,
    }
    const cf_handle = req.body['handle'];
    const db_user = await user_data.findOne({ where: {email: user.email }});
    if (db_user === null) {
        return res.json( {
            message : 'User not found in database',
        });
    }
    const handle_exist = await user_data.findOne({where : {codeforces_username: cf_handle}});
    if (handle_exist !== null) {
        return res.json({
            message: 'handle already exist',
        });
    }
    await user_data.update({ codeforces_username: cf_handle }, { where: {email : user.email }});
    
    res.json({
        message : 'added succesfull',
    });
}

async function dataEntry(req, res) {
    
    const user = {
        name : req.user.name,
        email : req.user.email,
        handle : req.body['handle'],
    };
    // const contestData = req.body['contestData'];
    const contestData = req.body;
    const evalData = {
        date : contestData['date'],
        topic : contestData['topic'],
        contestId1 : contestData['id1'],
        contestId2 : contestData['id2'],
        contestId3 : contestData['id3'],
        contestId4 : contestData['id4'],

        index1 : contestData['index1'],
        index2 : contestData['index2'],
        index3 : contestData['index3'],
        index4 : contestData['index4'],

        level : Number(contestData['level']),
        
        R1 : Number(contestData['R1']),
        R2 : Number(contestData['R2']),
        R3 : Number(contestData['R3']),
        R4 : Number(contestData['R4']),

        T1 : (contestData['T1'] === "" || contestData['T1'] === null) ? null : Number(contestData['T1']),
        T2 : (contestData['T2'] === "" || contestData['T2'] === null) ? null : Number(contestData['T2']),
        T3 : (contestData['T3'] === "" || contestData['T3'] === null) ? null : Number(contestData['T3']),
        T4 : (contestData['T4'] === "" || contestData['T4'] === null) ? null : Number(contestData['T4']),
    }
    
    const Performance = performace(evalData.level, evalData.R1, evalData.R2, evalData.R3, evalData.R4, evalData.T1, evalData.T2, evalData.T3, evalData.T4);
    const search = await user_contest.findOne({
        where : {
            email : user.email
        },
        order : [['contest_no', 'DESC']]
    });
    
    let lastRating = (search === null) ? null : search['dataValues']['rating'];
    const contestNumber = (search === null ? 0 : search['dataValues']['contest_no'] + 1);
    let newRating = await rating(evalData.T1, Performance, lastRating, user.handle);

    let delta = 0;
    if (lastRating !== null) {
        delta = newRating - lastRating;
    }

    try {
        const entry = await user_contest.create({
            email : user.email,
            handle: user.handle,
            date: evalData.date,
            topic: evalData.topic,
            contest_no : (search === null) ? 0 : contestNumber,
            contest_level : contestData['level'],
            R1 : evalData.R1,
            R2 : evalData.R2,
            R3 : evalData.R3,
            R4 : evalData.R4,
            T1 : evalData.T1,
            T2 : evalData.T2,
            T3 : evalData.T3,
            T4 : evalData.T4,
            rating : newRating,
            performance : Performance,
            delta : delta,
            contestId1 : evalData.contestId1,
            contestId2 : evalData.contestId2,
            contestId3 : evalData.contestId3,
            contestId4 : evalData.contestId4,
            index1 : evalData.index1,
            index2 : evalData.index2,
            index3 : evalData.index3,
            index4 : evalData.index4,
        });
    } catch(error) {
        //console.log('ERROR OCCURED WHILE ENTERING DATA');
        //console.log(error);
    }
    res.send('successfull');
}

async function contestHistory(req, res) {
    const email = req.user.email;
    const contest_history = await user_contest.findAll({ where : {email : email }, order : [['contest_no', 'DESC']]});
    res.send(contest_history);
}

async function getLevel(req, res) {
    if (req.params.level !== '*') {
        const level = req.params.level;
        const fetch_level = await level_sheet.findOne({where : {level: level}});
        return res.send(fetch_level['dataValues']); 
    }
    else {
        const fetch_level = await level_sheet.findAll();
        return res.send(fetch_level);
    }
}

async function deleteData(req, res) {
    const email = req.user.email;
    const del = await user_contest.destroy({where: {email: email}})
    res.sendStatus(200);
}

async function upsolved(req, res) {
    const { pkid, id } = req.query;
    // console.log(pkid);
    // console.log(id);
    // const data = await user_contest.findOne({where: {email: req.user.email, id: pkid}});
    if (Number(id) === 1) {
        const update = await user_contest.update({T1: -1}, {where: {email: req.user.email, id: pkid}});
    } else if (Number(id) === 2) {
        const update = await user_contest.update({T2: -1}, {where: {email: req.user.email, id: pkid}});
    } else if (Number(id) === 3) {
        const update = await user_contest.update({T3: -1}, {where: {email: req.user.email, id: pkid}});        
    } else if (Number(id) === 4) {
        const update = await user_contest.update({T4: -1}, {where: {email: req.user.email, id: pkid}});
    }
    res.send('ok');
}

module.exports = {
    add_user,
    user_profile,
    addHandle,
    dataEntry,
    contestHistory,
    getLevel,
    user_auth,
    logout,
    generateToken,
    deleteData,
    upsolved
}