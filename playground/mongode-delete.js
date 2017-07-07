const {MongoClient, ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
    if(err){
        return console.log("unable to connect to MongoDB server");
    }
    console.log("connnected to MongoDb server");
    //deleteMany
    // db.collection("Todos").deleteMany({text: "Eat lunch"}).then((result)=>{
    //     console.log(result);
    // }, (err) => {
    //     console.log("unable to delete :", err);
    // });
    //deleteOne
    db.collection("Todos").deleteOne({text: "Eat lunch"}).then((result)=>{
        console.log(result);
    }, (err) => {
        console.log("unable to delete :", err);
    });
    //findOneAndDelete
    // db.collection("Todos").findOneAndDelete({completed: false}).then((result)=>{
    //     console.log(result);
    // }, (err) => {
    //     console.log("unable to delete :", err);
    // });
    //db.close();
});