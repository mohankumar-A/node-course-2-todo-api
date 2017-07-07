const {MongoClient, ObjectID} = require("mongodb");


var obj = new ObjectID();

return console.log(obj);


MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
    if(err){
        return console.log("unable to connect to MongoDB server");
    }
    console.log("connnected to MongoDb server");
    // db.collection("Todos").insertOne({
    //     text: "something to do",
    //     completed: false
    // }, (err, result)=>{
    //     if(err){
    //         return console.log("unable to insert Todo", err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    db.collection("Users").insertOne({
        name: "Mohan Kumar",
        age: 31,
        location: "chennai"
    }, (err, result)=>{
        if(err){
            return console.log("unable to insert User", err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
    });

    db.close();
});