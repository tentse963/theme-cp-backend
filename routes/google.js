const express = require('express');
const passport = require('passport');
const session = require('express-session');  // Use express-session instead of cookie-session
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { jwttoken } = require('../controllers/jwttoken');
require('dotenv').config();

const auth_router = express.Router();


// Route for Google login
auth_router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Google callback URL
auth_router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/api/user/fail_login'
}), jwttoken);

module.exports = auth_router;
