const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');          // <-- tambahkan ini
const userRoutes = require('./routes/userRoutes');
const menstrualCycleRoutes = require('./routes/menstrualCycleRoutes');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());                      // <-- tambahkan ini
app.use(bodyParser.json());

// Routes
app.use('/users', userRoutes);
app.use('/menstrual-cycles', menstrualCycleRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
