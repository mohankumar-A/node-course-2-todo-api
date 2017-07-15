require("./config/config");
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const {ObjectID} = require("mongodb");

var {mongoose} = require("./db/mongoose");
var {Todo} = require("./models/todo");
var {User} = require("./models/user");

var app = express();

var port = process.env.port;

app.use(bodyParser.json());

app.post("/todos", (req, res)=>{
    //console.log(req.body);
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
       res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });

});

app.get("/todos", (req, res) => {

    Todo.find().then((todos)=>{
        res.send({todos});
    }, (err) => {
       res.status(400).send(err);
    });
});

//get /todos/12345
app.get("/todos/:id", (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        res.status(404).send();
    }

    Todo.findById(id).then((todo) => {
       if(!todo){
           res.status(404).send();
       }
       res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
});

app.delete("/todos/:id", (req, res) => {

    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }, (err) => {
        res.status(400).send(err);
    });
});

app.patch("/todos/:id", (req, res)=>{

    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    console.log("completed", body);

    Todo.findByIdAndUpdate(id,
        {
            $set: body
        },
        {
            new: true
        }
    ).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((err) => {
        res.status(404).send();
    });
});

app.post("/users", (req, res) => {

    let body = _.pick(req.body, ['email', 'password']);
    let user = new User(body);

    user.save().then(() => {
       return user.generateAuthToken();
    }).then((token)=>{
        console.log("token",token);
        res.header('x-auth', token).send(user);
    }).catch((e)=>{
        res.status(400).send(e);
    });

});

app.get("/users/me", (req, res) => {
    var token =req.header('x-auth');

    User.findByToken(token).then((user) =>{
        if(!user){
            return res.status(404).send();
        }
        res.send(user);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.listen(port, () => {
   console.log(`server is on port ${port}`);
});


module.exports = {app};