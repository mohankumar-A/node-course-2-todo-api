const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcryptjs");

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            //can be write as below
            // validator: (value) => {
            //     return validator.isEmail(value);
            // },
            isAsync: true,
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6,
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function(){
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ["_id", "email"]);
};


UserSchema.methods.generateAuthToken = function(){
    var user = this;
    var access = "auth";
    var token = jwt.sign({_id: user._id.toHexString(), access}, "abc123").toString();
    user.tokens.push({access, token});
    return user.save().then(() => {
        return token;
    })
};

UserSchema.methods.removeToken = function(token){
    let user = this;
    return user.update({
        $pull: {
            tokens: {token}
        }
    });
};

UserSchema.pre("save", function(next){
   var user = this;

   if(user.isModified("password")){
        var password = user.password;
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                user.password = hash;
                next();
            })
        });
   } else {
       next();
   }

});

UserSchema.statics.findByToken = function(token){
    var User = this;
    var decode;

    try{
        decode = jwt.verify(token, 'abc123');
    } catch(e) {
        //this can be written as below
        return new Promise((resolve, reject) => {
           reject();
        });
        //return Promise.reject();
    }

    return User.findOne({
        '_id': decode._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.statics.findByCredentials = function(email, password){
    let User = this;

    return User.findOne({email}).then((user) => {
        if(!user){
            return new Promise((resolve, reject) => {
                reject();
            });
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
               if(res){
                   resolve(user);
               } else {
                   reject();
               }
            });
        });
    });
};


var User = mongoose.model("User", UserSchema);

module.exports = {User};