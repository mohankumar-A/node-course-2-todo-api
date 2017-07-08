const {ObjectID} = require("mongodb");
const {mongoose} = require("./../server/db/mongoose");
const {Todo} = require("./../server/models/todo");
const {User} = require("./../server/models/user");

//var id = "596099b2cc99ff2e388446ff111";
//
// if(!ObjectID.isValid(id)){
//     console.log("Id not valid");
// }

// Todo.find({
//     _id: id
// }).then((todos) => {
//    console.log("Todos: ", todos);
// });
//
// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log("Todo: ", todo);
// });

// Todo.findById(id).then((todo) => {
//     if(!todo){
//         return console.log("Id not found");
//     }
//    console.log("Todo find by id: ", todo);
// }).catch((e) => {console.log(e)});

User.findById("595f928913bcc64258b4aa21").then((user)=>{
    if(!user){
        return console.log("no user fetched");
    }
    console.log("User: ", user);
}).catch((e) => console.log(e));