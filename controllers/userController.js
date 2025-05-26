const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
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
  },
    async register(req, res) {
    try {
      const { nama, email, password } = req.body;

      // Cek apakah email sudah terdaftar
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email sudah digunakan' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        nama,
        email,
        password: hashedPassword
      });

      const { password: _, ...userData } = user.toJSON();
      res.status(201).json({ message: 'Registrasi berhasil', user: userData });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Email tidak ditemukan' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Password salah' });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: '1d'
      });

      const { password: _, ...userData } = user.toJSON();
      res.json({ message: 'Login berhasil', user: userData, token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
