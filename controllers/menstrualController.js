const { MenstrualCycle } = require('../models');

module.exports = {
  // Get all menstrual cycles
  async getAll(req, res) {
    try {
      const cycles = await MenstrualCycle.findAll();
      res.json(cycles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get cycle by ID
  async getById(req, res) {
    try {
      const cycle = await MenstrualCycle.findByPk(req.params.id);
      if (!cycle) return res.status(404).json({ message: 'Cycle not found' });
      res.json(cycle);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Create new cycle
async create(req, res) {
  try {
    const { user_id, start_date, end_date, notes } = req.body;

    // Konversi tanggal ke objek Date
    const start = new Date(start_date);
    const end = new Date(end_date);

    // Hitung durasi menstruasi (period_length)
    const period_length = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;

    // Asumsikan cycle_length 28 hari jika tidak diketahui
    const cycle_length = 28;

    // Ovulasi biasanya terjadi 14 hari sebelum siklus berikutnya
    const ovulation_date = new Date(start);
    ovulation_date.setDate(ovulation_date.getDate() + (cycle_length - 14));

    // Masa subur biasanya 5 hari sebelum ovulasi sampai 1 hari setelah
    const fertile_window_start = new Date(ovulation_date);
    fertile_window_start.setDate(fertile_window_start.getDate() - 5);

    const fertile_window_end = new Date(ovulation_date);
    fertile_window_end.setDate(fertile_window_end.getDate() + 1);

    const cycle = await MenstrualCycle.create({
      user_id,
      start_date,
      end_date,
      cycle_length,
      period_length,
      ovulation_date,
      fertile_window_start,
      fertile_window_end,
      notes
    });

    res.status(201).json(cycle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},
  // Update cycle
  async update(req, res) {
    try {
      const cycle = await MenstrualCycle.findByPk(req.params.id);
      if (!cycle) return res.status(404).json({ message: 'Cycle not found' });

      await cycle.update(req.body);
      res.json(cycle);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete cycle
  async delete(req, res) {
    try {
      const cycle = await MenstrualCycle.findByPk(req.params.id);
      if (!cycle) return res.status(404).json({ message: 'Cycle not found' });

      await cycle.destroy();
      res.json({ message: 'Cycle deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
