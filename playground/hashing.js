const {SHA256} = require("crypto-js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

var password = "123abc!";

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    });
});

var hashedPassword = "$2a$10$dvohvND1yAh2IsyQsT2mVebSNRRbDfPeySkOz41BvE58BgWgaVv3u";

bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log(res);
});

// var data = {
//     id: 4
// }
//
// var token = jwt.sign(data, "123mictesting");
// console.log(token);
//
// var decode = jwt.decode(token, "123mictesting");
// console.log("decoded: ", decode);

// let message = "I am user number 3";
// let crypt = SHA256(message).toString();
//
// console.log(`message: ${message}`);
// console.log(`crypt: ${crypt}`);
//
// let data = {
//     id: 4
// };
//
// let token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + "some secret").toString()
// };
//
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(data)).toString();
//
//
// let resultHash = SHA256(JSON.stringify(token.data) + "some secret").toString();
//
// if(resultHash === token.hash){
//     console.log("good to go");
// } else {
//     console.log("Hacker in place, do not trust");
// }

