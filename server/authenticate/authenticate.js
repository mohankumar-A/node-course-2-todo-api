const {User} = require("./../models/user");

let authenticate = (req, res, next) => {
    let token =req.header('x-auth');

    User.findByToken(token).then((user) =>{
        if(!user){
            return new Promise((resolve, reject) => {
              reject();
            });
        }
        req.user = user;
        req.token = token;
        next();
    }).catch((err) => {
        res.status(401).send();
    });
};

module.exports = {authenticate};