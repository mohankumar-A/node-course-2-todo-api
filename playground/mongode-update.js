const {MongoClient, ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
    if(err){
        return console.log("unable to connect to MongoDB server");
    }
    console.log("connnected to MongoDb server");

    // db.collection("Todos").findOneAndUpdate({
    //                                             _id: new ObjectID("595f80d96894920a554b05f8")
    //                                         },
    //                                         {
    //                                             $set: {
    //                                                 completed: true
    //                                             }
    //                                         },
    //                                         {
    //                                             returnOriginal: false
    //                                         }).then((document) => {
    //                                             console.log(document);
    //                                         }, (err) => {
    //                                             console.log("unable to update document ", err);
    //                                         });
    db.collection("Users").findOneAndUpdate({
                                                _id: new ObjectID("595f619d3a77be0d78630e34")
                                            },
                                            {
                                                $set: {
                                                    name: "Jane"
                                                },
                                                $inc: {
                                                    age: 1
                                                }
                                            },
                                            {
                                                returnOriginal: false
                                            }).then((document) => {
                                                console.log(document);
                                            }, (err) => {
                                                console.log("unable to update document ", err);
                                            });

    //db.close();
});