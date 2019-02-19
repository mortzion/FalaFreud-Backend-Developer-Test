/**
 * Arquivo principal. Declara e inicializa o servidor e se conecta com o banco de dados.
 */

let express = require("express");
let mongoose = require("mongoose");
let bodyParser = require("body-parser");
let config = require("./src/config/config");
let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let dbLink;

//Utiliza o banco de dados de testes caso o servidor esteja no ambiente de desenvolvimento
if (process.env.NODE_ENV === "production") {
  dbLink = config.db;
} else {
  dbLink = config.testDb;
}

mongoose.connect(dbLink, { useNewUrlParser: true }).catch(function(error) {
  console.log("Couldn't connect to the database server");
  console.log(error);
  process.exit(500);
});

//Faz com que o mongoose não utilize o método depreciado useFindAndModify
mongoose.set("useFindAndModify", false);

app.use(require("./src/router/user"));

app.listen(config.port, function() {
  console.log("API running on port " + config.port);
});

module.exports = app;
