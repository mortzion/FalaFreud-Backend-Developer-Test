/**
 * Define as rotas para a API de usuários e relaciona com os respectivos controladores.
 */

let express = require("express");
let userRoutes = express.Router();

let User = require("../models/user");
let UserController = require("../controllers/user");

userRoutes.post("/api/users", UserController.create);
userRoutes.get("/api/users", UserController.recoverAll);
userRoutes.get("/api/users/:id", UserController.recover);
userRoutes.put("/api/users/:id", UserController.update);
userRoutes.delete("/api/users/:id", UserController.delete);

module.exports = userRoutes;
