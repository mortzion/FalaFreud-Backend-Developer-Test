/**
 * Define o modelo do usuário no banco de dados.
 */

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "The field name is required."],
    minlength: [1, "The name cannot be empty."]
  },
  age: {
    type: Number,
    min: [0, "The field age cannot be negative."]
  },
  phone: {
    type: String,
    match: /[0-9]*$/ //Um número de telefone é considerado como apenas digitos e de qualquer comprimento.
  },
  is_admin: { type: Boolean, default: false, required: true }
});

module.exports = mongoose.model("User", UserSchema);
