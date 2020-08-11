const mongoose = require('mongoose')
const crypto = require('crypto') // to store hashed passwords for user
// const uuidv1 = require('uuid/v1') // to genereate unique strings
const { v1: uuidv1 } = require('uuid');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        require: true,
        maxlength: 32
    },
    email: {
        type: String,
        trim: true,
        require: true,
        unique: 32
    },
    hashed_password: {
        type: String,
        require: true
    },
    about: {
        type:String,
        trim: true
    },
    salt: String, // to generate hashed password, long string
    role:{
        type: Number, //0 user, 1 admin
        default: 0,
    },
    history: {
        type: Array,
        default: []
    }
}, {timestamps: true})

userSchema.virtual('password')
.set(function(password){
    this._password = password,
    this.salt = uuidv1() // this will generate and store unique string for purpose of hashing
    this.hashed_password = this.encryptPassword(password)
})
.get(function() {
    return this._password
})

userSchema.methods = {

    authenticate: function(plainText){
        return this.encryptPassword(plainText) === this.hashed_password
    },

    encryptPassword: function(password){
        if(!password) return '';
        try{
            return crypto.createHmac('sha1', this.salt)
                .update(password)
                .digest('hex')
        } catch(err){
            return '';
        }
    } 
}

module.exports = mongoose.model("User", userSchema)
