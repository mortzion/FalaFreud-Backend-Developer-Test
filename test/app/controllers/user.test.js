/**
 * Rótina de testes para a API de usuários.
 */

let chai = require("chai");
let mongoose = require("mongoose");
let chaiHttp = require("chai-http");
let UserModel = require("../../../src/models/user");

let expect = chai.expect;

chai.use(chaiHttp);

let app = require("../../../index");

describe("UserController test", function() {
  //Dados de usuário usados nas rotinas de teste que precisam criar um novo usuário
  let newUserTemplate = {
    name: "NameTest",
    age: 23,
    phone: "11111",
    is_admin: false
  };

  //Dados de usuário usados nas rotinas de teste que precisam atualizar os dados de um usuário
  let updateUserTemplate = {
    name: "New Name",
    age: 24,
    phone: "22222",
    is_admin: true
  };

  //Armazena o ID de um usuário cadastrado no banco de dados para serem usados por outras rotinas
  let newUserId;

  //Aumenta o timeout da conexão, para os casos em a comunicação com o servidor está lenta
  this.timeout(10000);

  //Após todos os testes serem realizados o banco de dados de testes é limpo
  after(function(done) {
    UserModel.deleteMany({}, function() {
      done();
    });
  });

  /**
   * Rotinas para testar a função de criação de um novo usuário. 
   */ 
  describe("Create user test", function() {
    it("should create a user", function(done) {
      chai.request(app).post("/api/users").send(newUserTemplate).end(function(err, res) {
          expect(res.status).to.equal(201);
          
          //Verifica se todos os campos do usuário estão corretos
          Object.keys(newUserTemplate).forEach(index => {
            expect(newUserTemplate[index]).to.be.equal(res.body[index]);
          });
          newUserId = res.body._id;
          done();
        });
    });

    it("should throw a error due to missing name", function(done) {
      chai.request(app).post("/api/users").send({ age: 23 }).end(function(err, res) {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.not.be.undefined;
          done();
        });
    });

    it("should throw an error due to negative age", function(done) {
      chai.request(app).post("/api/users").send({ ...newUserTemplate, age: -23 }).end(function(err, res) {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.not.be.undefined;
          done();
        });
    });
  });

  /**
   * Rotinas para testar a função de busca por usuários. 
   */ 
  describe("Search user test", function() {
    it("should return a user which has the given id", function(done) {
      chai.request(app).get(`/api/users/${newUserId}`).end(function(err, res) {
          expect(res.status).to.equal(200);
          
          //Verifica se todos os campos do usuário estão corretos
          Object.keys(newUserTemplate).forEach(index => {
            expect(newUserTemplate[index]).to.be.equal(res.body[index]);
          });
          done();
        });
    });

    it("should not find a user with the given id", function(done) {
      chai.request(app).get(`/api/users/${mongoose.Types.ObjectId()}`).end(function(err, res) {
          expect(res.status).to.equal(404);
          expect(res.body.error).to.not.be.undefined;
          done();
        });
    });

    it("should throw an error due to invalid id", function(done) {
      chai.request(app).get("/api/users/123").end(function(err, res) {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.not.be.undefined;
          done();
        });
    });
  });

  /**
   * Rotinas para testar a função de atualizar os dados dos usuários. 
   */ 
  describe("Update User test", function() {
    it("should update the user which has the given id", function(done) {
      chai.request(app).put(`/api/users/${newUserId}`).send(updateUserTemplate).end(function(err, res) {
          expect(res.status).to.equal(200);
          
          //Verifica se todos os campos do usuario foram atualizados corretamente
          Object.keys(updateUserTemplate).forEach(index => {
            expect(updateUserTemplate[index]).to.be.equal(res.body[index]);
          });
          expect(res.body._id).to.be.equal(newUserId);
          done();
        });
    });

    it("should throw an error due to not finding the user", function(done) {
      chai.request(app).put(`/api/users/${mongoose.Types.ObjectId()}`).send(updateUserTemplate).end(function(err, res) {
          expect(res.status).to.equal(404);
          expect(res.body.error).to.not.be.undefined;
          done();
        });
    });

    it("should throw an error due to invalid update parameter", function(done) {
      chai.request(app).put(`/api/users/${newUserId}`).send({ age: -20 }).end(function(err, res) {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.not.be.undefined;
          done();
        });
    });
  });

  /**
   * Rotinas para testar a função de remover usuários do banco de dados. 
   */ 
  describe("Remove user test", function() {
    it("should remove the user which has the given id", function(done) {
      chai.request(app).delete(`/api/users/${newUserId}`).end(function(err, res) {
          expect(res.status).to.equal(204);
          done();
        });
    });

    it("should throw an error due to not finding the user", function(done) {
      chai.request(app).delete(`/api/users/${mongoose.Types.ObjectId}`).end(function(err, res) {
          expect(res.status).to.equal(404);
          done();
        });
    });

    it("should throw and error due to invalid ObjectId", function(done) {
      chai.request(app).delete("/api/users/123").end(function(err, res) {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.not.be.undefined;
          done();
        });
    });
  });

  /**
   * Rotinas para testar a função de recuperar todos os usuários do banco de dados.
   */ 
  describe("Get all users test", function() {
    //Remove todos os usuários do banco de dados antes da execução de cada teste deste bloco
    before(function(done) {
      UserModel.deleteMany({}, function() {
        done();
      });
    });

    it("should get all users(empty database)", function(done) {
      chai.request(app).get("/api/users").end(function(err, res) {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an("array");
          expect(res.body.length).to.be.equal(0);
          done();
        });
    });

    it("should get all users", function(done) {
      chai.request(app).post("/api/users").send(newUserTemplate).end();
      chai.request(app).get("/api/users").end(function(err, res) {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an("array");
          expect(res.body.length).to.be.equal(1);
          done();
        });
    });
  });
});
