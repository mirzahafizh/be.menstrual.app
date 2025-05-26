const { User } = require('../models');
const bcrypt = require('bcryptjs');

module.exports = {
  // GET all users
  async getAll(req, res) {
    try {
      const users = await User.findAll({ attributes: { exclude: ['password'] } }); // sembunyikan password
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET user by ID
  async getById(req, res) {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['password'] }
      });
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // POST create new user
  async create(req, res) {
    try {
      const { nama, email, password } = req.body;

      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        nama,
        email,
        password: hashedPassword
      });

      // jangan kirim password ke response
      const { password: _, ...userData } = user.toJSON();

      res.status(201).json(userData);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // PUT update user
  async update(req, res) {
    try {
      const { nama, email, password } = req.body;
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      // hash password jika ada
      const updatedData = { nama, email };
      if (password) {
        updatedData.password = await bcrypt.hash(password, 10);
      }

      await user.update(updatedData);

      const { password: _, ...userData } = user.toJSON();
      res.json(userData);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // DELETE user
  async delete(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      await user.destroy();
      res.json({ message: 'User deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
