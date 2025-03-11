const express = require('express')
const helmet = require('helmet')
const path = require('path');
const passport = require('passport');
const {Strategy} = require('passport-google-oauth20') 

require('dotenv').config()

const config = {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET:process.env.CLIENT_SECRET
  }
  
const AUTH_OPTIONS = {
    callbackURL:'/auth/google/callback',
    clientID: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET
} 

function verifyCallback(accessToken, refreshToken, profile, done){ // called when the user is authenticated
    console.log('Google profile', profile)
    done(null, profile) // if user is done, passport knows that the user is logged in
}

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback))

const app = express()

app.use(helmet())
app.use(passport.initialize()) // returns passport middleware that help set the passport

function checkLoggedIn(req, res, next){
    const loggedIn = true;
    if(!loggedIn){
        return res.status(401).json({
            error: 'You must log in!',
        })
    }
    next();
}

app.get('/auth/google',passport.authenticate('google', {
    scope:['email'],
})) // for google login

app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/failure',
    successRedirect:'/',
    session: false
}), (req, res)=>{
    console.log("Google called us back")
}) // callback url specify the redirect

app.get('/auth/logout', (req, res)=>{})

app.use(express.json())
app.get('/secret',checkLoggedIn, (req, res) =>{
   return res.send('Your personal secret value is 42!')
} )

app.get('/failure', (req, res)=>{
    res.send('Failed to log in')
})

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})


module.exports = app;