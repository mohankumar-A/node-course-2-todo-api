const expect = require("expect");
const request = require("supertest");
const {app} = require("./../server");
const {Todo} = require("./../models/todo");
const {User} = require("./../models/user");
const {ObjectID} = require("mongodb");
const {populateTodos, todos, users, populateUsers} = require("./seed/seed");

beforeEach(populateUsers);
beforeEach(populateTodos);

describe("post /todos", () => {

    it("should create a new todo", (done) => {
        var text = "Test todo text";

        request(app)
            .post("/todos")
            .set("x-auth", users[0].tokens[0].token)
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
            .set("x-auth", users[0].tokens[0].token)
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
            .set("x-auth", users[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todos.length).toBe(1);
            })
            .end(done);
    });
});


describe("get /todos/id route", () => {

    it("should return todo from id", (done) => {

        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set("x-auth", users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it("should not return todo created from other user", (done) => {

        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set("x-auth", users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it("should return 404 if todo not found", (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .set("x-auth", users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it("should return 404 for non object ids", (done) => {
       request(app)
           .get("/todos/123")
           .set("x-auth", users[0].tokens[0].token)
           .expect(404)
           .end(done);
    });
});


describe("Remove /todos/:id", () => {

    it(`should remove todo`, (done) => {
        var hexString = todos[1]._id.toHexString();

        request(app)
           .delete(`/todos/${hexString}`)
           .set("x-auth", users[1].tokens[0].token)
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

    it(`should remove todo`, (done) => {
        var hexString = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexString}`)
            .set("x-auth", users[0].tokens[0].token)
            .expect(404)
            .end((err, res)=>{
                if(err){
                    return done(err);
                }

                Todo.findById(hexString).then((doc) => {
                    expect(doc).toExist();
                    done();
                }).catch((err) => done(err));

            });
    });

    it("should get 404 error for object not found", (done) => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .set("x-auth", users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it("should get 404 error for non object ids", (done) => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString() + "123"}`)
            .set("x-auth", users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

});

describe("PATCH /todos/:id", () => {

    it("should update the todo", (done) => {
        let hexString = todos[0]._id.toHexString();
        let text = "This should be the new text";
        request(app)
            .patch(`/todos/${hexString}`)
            .set("x-auth", users[0].tokens[0].token)
            .send({
                completed: true,
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done);
    });

    it("should not update the todo created by other user", (done) => {
        let hexString = todos[0]._id.toHexString();
        let text = "This should be the new text";
        request(app)
            .patch(`/todos/${hexString}`)
            .set("x-auth", users[1].tokens[0].token)
            .send({
                completed: true,
                text
            })
            .expect(404)
            .end(done);
    });

    it("should clear completedat when todo is not completed", (done) => {
        let id = todos[1]._id.toHexString();
        let text = "This is new second text";

        request(app)
            .patch(`/todos/${id}`)
            .set("x-auth", users[1].tokens[0].token)
            .send({
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end(done);
    });

});


describe("GET users/me", ()=>{

    it("should return user if authenticated", (done) => {
        request(app)
            .get("/users/me")
            .set("x-auth", users[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it("should return 401 if user is not authenticated", (done) => {
        request(app)
            .get("/users/me")
            .expect(401)
            .expect((res)=> {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe("POST /users", () => {

    it("should create users", (done) => {
       let email = "example@abc.com";
       let password = "abc123456";

       request(app)
           .post("/users")
           .send({email,password})
           .expect(200)
           .expect((res)=>{
                expect(res.headers["x-auth"]).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
           })
           .end((err) => {
                if(err){
                    return done(err);
                }

                User.findOne({email}).then((user)=>{
                   expect(user).toExist();
                   expect(user.password).toNotBe(password);
                   done();
                }).catch((err) => {
                    done(err);
                });
           });
    });

    it("should throw validation error", (done) => {
        let email = "email";
        let password = "123";

        request(app)
            .post("/users")
            .send({email,password})
            .expect(400)
            .end(done);
    });

    it("should not create user if user is in use", (done) => {
        let email = users[0].email;
        let password = "Password123@";

        request(app)
            .post("/users")
            .send({email, password})
            .expect(400)
            .end(done);
    });

});


describe("POST /users/login", ()=>{

    it("should login user and return auth token", (done)=>{
        let email = users[1].email;
        let password = users[1].password;

        request(app)
            .post("/users/login")
            .send({email, password})
            .expect(200)
            .expect((res)=>{
                expect(res.body.email).toBe(email);
                expect(res.headers["x-auth"]).toExist();
            })
            .end((err, res)=>{
                if(err){
                    return done(err);
                }

                User.findOne({email}).then((user) => {
                   expect(user.tokens[1]).toInclude({
                        access: "auth",
                        token: res.headers["x-auth"]
                   });
                   done();
                }).catch((err) => {
                    done(err);
                });
            });
    });

    it("should return invalid login", (done)=>{
        request(app)
            .post("/users/login")
            .send({email: users[1].email, password:"abc112"})
            .expect(400)
            .expect((res)=>{
                expect(res.headers["x-auth"]).toNotExist();
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                User.findOne({email: users[1].email}).then((user) => {
                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch((e) => done(e));

            });
    });

});

describe("DELETE /users/me/token", ()=>{
   it("should delete token", (done)=>{
      request(app)
          .delete("/users/me/token")
          .set("x-auth", users[0].tokens[0].token)
          .expect(200)
          .end((err, res) => {
            if(err){
                return done(err);
            }

            User.findById(users[0]._id.toHexString()).then((user) => {
                expect(user.tokens.length).toBe(0);
                done();
            }).catch((e)=>done(e));

          })
   });
});
