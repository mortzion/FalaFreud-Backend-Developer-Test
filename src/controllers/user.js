/**
 *
 * Controlador para os métodos da API referentes ao usuário
 *
 */

const User = require("../models/user");

module.exports = {
  /**
   * Cria uma instancia no banco de dados de um usuário com os dados
   * obtidas no corpo da requisição.
   */
  async create(req, res) {
    try {
      const user = await User.create(req.body);
      return res.status(201).json(user);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  /**
   * Recupera todos os usuário do banco de dados
   */
  async recoverAll(req, res) {
    try {
      const users = await User.find({});
      return res.json(users);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  /**
   * Recupera um único usuário de acordo com o ID.
   * O ID é recebido como parâmetro da URL /api/users/:id.
   */
  async recover(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (user === null) {
        return res.status(404).json({ error: "User not found!" });
      }
      return res.json(user);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  /**
   * Atualiza os dados de um usuário especificado pelo ID.
   * O ID é recebido como parâmetro da URL /api/users/:id.
   */
  async update(req, res) {
    try {
      let user = await User.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true
      });
      if (user === null) {
        return res.status(404).json({ error: "User not found!" });
      }
      return res.json(user);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  /**
   * Remove os dados no banco de dados de um usuário especificado pelo ID.
   * O ID é recebido como parâmetro da URL /api/users/:id.
   */
  async delete(req, res) {
    try {
      let user = await User.findOneAndDelete({ _id: req.params.id });
      if (user === null) {
        return res.status(404).json({ error: error.message });
      }
      return res.status(204).json();
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
};
