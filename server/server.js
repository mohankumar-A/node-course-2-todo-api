var express = require("express");
var bodyParser = require("body-parser");

const {ObjectID} = require("mongodb");
var {mongoose} = require("./db/mongoose");
var {Todo} = require("./models/todo");
var {User} = require("./models/user");

var app = express();

var port = process.env.port || 3000;

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

    if(!ObjecctID.isValid(id)){
        return res.status(404).send();
    }

    Todo.findIdAndRemove(id).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        res.send(todo);
    }).catch((e) => {
        res.status(400).send();
    });
});


app.listen(port, () => {
   console.log(`server is on port ${port}`);
});


module.exports = {app};