const expect = require("expect");
const request = require("supertest");
const {app} = require("./../server");
const {Todo} = require("./../models/todo");
const {ObjectID} = require("mongodb");

const todos = [{
        _id : new ObjectID(),
        text: "First test todo"
    },{
        _id : new ObjectID,
        text: "Second test todo"
    }];

beforeEach((done) => {
    Todo.remove({}).then(()=> {
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe("post /todos", () => {

    it("should create a new todo", (done) => {
        var text = "Test todo text";

        request(app)
            .post("/todos")
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                Todo.find({text}).then((todos)=>{
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e)=> done(e));
            });
    });


    it("should be failed to create todo", (done) => {

        var text = {};

        request(app)
            .post("/todos")
            .send(text)
            .expect(400)
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                Todo.find().then((docs) => {
                   expect(docs.length).toBe(2);
                   done();
                }).catch((err) => {
                    return done(err);
                });

            });
    });

});


describe("get /todos route", ()=> {

    it("should get all todos", (done) => {
        request(app)
            .get("/todos")
            .expect(200)
            .expect((res)=>{
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});


describe("get /todos/id route", () => {

    it("should return todo from id", (done) => {

        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it("should return 404 if todo not found", (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });

    it("should return 404 for non object ids", (done) => {
       request(app)
           .get("/todos/123")
           .expect(404)
           .end(done);
    });
});


describe("Remove /todos/:id", () => {

    it(`should remove todo`, (done) => {
        var hexString = todos[1]._id.toHexString();

        request(app)
           .delete(`/todos/${hexString}`)
           .expect(200)
           .expect((res) => {
                expect(res.body.todo._id).toBe(hexString);
           })
           .end((err, res)=>{
                if(err){
                    return done(err);
                }

                Todo.findById(hexString).then((doc) => {
                    expect(doc).toNotExist();
                    done();
                }).catch((err) => done(err));

           });
    });

    it("should get 404 error for object not found", (done) => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });

    it("should get 404 error for non object ids", (done) => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString() + "123"}`)
            .expect(404)
            .end(done);
    });

});