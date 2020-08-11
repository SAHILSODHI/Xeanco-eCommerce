const User = require('../models/user')
const {errorHandler} = require('../helpers/dbErrorHandler')
const jwt = require('jsonwebtoken') // to genereate signed token
const expressJwt = require('express-jwt') // for authorization check

exports.signup = (req, res) => {
    console.log("req.body", req.body)
    const user = new User(req.body) // make sure body-parser is installed
    user.save((err, user) => {
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        user.salt = undefined,
        user.hashed_password = undefined
        res.json({
            user
        })
    })
}

exports.signin = (req, res) => {
    // find the user based on email
    const {email, password} = req.body
    User.findOne({email}, (err, user) => {
        if(err || !user){
            return res.status(400).json({
                error: 'user not found with this email address. Please sign up'
            })
        }
    // if user found make sure email and pswd match
    // create authenticate method in user model
    if(!user.authenticate(password)){
        return res.status(401).json({
            error: 'Email and password do not match'
        })
    }

    // genereate a signed token with user_id and secret
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
    // persist the token as 't'(or anything) in cookie with expiry date
    res.cookie('t', token, {expire: new Date() + 9999})
    // return response with user and token to frontend client
    const{_id, name, email, role} = user
    return res.json({token, user: {_id, email, name, role}}) // no need of user._id and so on due to destructuring
    })
}

exports.signout = (req, res) => {
    res.clearCookie('t');
    res.json({message: "Signout success"})
}

// to give route access to only logged in users, use as middleware for protection
exports.requireSignIn = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: 'auth'
})

