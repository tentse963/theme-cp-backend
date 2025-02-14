const express = require('express');

const {authenticate} = require('../middlewares/auth');
const { upsolved, deleteData, generateToken, add_user, logout, user_auth, user_profile, addHandle, dataEntry, contestHistory, getLevel } = require('../controllers/api');
// const { level_sheet } = require('../models/postgres_connection');

const api_router = express.Router();

api_router.post('/add_user', authenticate, add_user);

api_router.post('/get_token', generateToken);

api_router.get('/authenticate', authenticate, user_auth);

api_router.get('/profile', authenticate, user_profile);

api_router.post('/addHandle', authenticate, addHandle);

api_router.post('/addContestData', authenticate, dataEntry);

api_router.get('/contestHistory', authenticate, contestHistory);

api_router.get('/level/:level', getLevel);

api_router.get('/logout', logout);

api_router.delete('/deleteData', authenticate, deleteData);

api_router.patch('/upsolved', authenticate, upsolved);


module.exports = api_router;