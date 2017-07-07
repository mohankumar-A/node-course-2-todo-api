const {MongoClient, ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
    if(err){
        return console.log("unable to connect to MongoDB server");
    }
    console.log("connnected to MongoDb server");

    // db.collection("Todos").find({_id: new ObjectID("595f66ba6894920a554afe9f")}).toArray().then((docs) => {
    //     console.log("Todos");
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log("Unable to fetch todos", err);
    // });

    // db.collection("Todos").find().count().then((count) => {
    //     console.log(`Todos:  ${count}` );
    // }, (err) => {
    //     console.log("Unable to fetch todos", err);
    // });

    db.collection("Users").find({name: "Mage"}).toArray().then((document)=>{
        console.log("Users");
        console.log(JSON.stringify(document, undefined, 2));
    }, (err) => {
        console.log(`Unable to fetch Users ${err}`);
    });

    //db.close();
});