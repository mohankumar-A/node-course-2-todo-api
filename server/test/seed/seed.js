const {ObjectID} = require("mongodb");
const {Todo} = require("./../../models/todo");
const {User} = require("./../../models/user");
const jwt = require("jsonwebtoken");

const userOneID = new ObjectID();
const userTwoID = new ObjectID();
const users = [{
   _id: userOneID,
    email: "abc@gmail.com",
    password: "useronePassword",
    tokens: [{
       access: "auth",
       token: jwt.sign({_id: userOneID.toHexString(), access:"auth"}, "abc123").toString()
    }]
},{
    _id : userTwoID,
    email: "abcc@test.com",
    password: "usertwoPassword"
}];

const todos = [{
    _id : new ObjectID(),
    text: "First test todo"
},{
    _id : new ObjectID,
    text: "Second test todo",
    completed: true,
    completedAt: 333
}];

const populateTodos = (done) => {
    Todo.remove({}).then(()=> {
        return Todo.insertMany(todos);
    }).then(() => done());
};

const populateUsers = (done) => {
    User.remove({}).then(() => {

        let userOne = new User(users[0]).save();
        let userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo]).then(()=>{
            done();
        });
    });
};

module.exports = {populateTodos, todos, users, populateUsers};