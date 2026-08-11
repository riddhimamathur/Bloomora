const express = require('express');
const cors = require('cors');
const { port, prisma } = require('./config/env');

const authRoutes = require('./routes/auth.routes');
const vibesRoutes = require('./routes/vibes.routes');
const searchRoutes = require('./routes/search.routes');

const app = express();

// Enable CORS for frontend client
app.use(cors({
  origin: '*', // Allow all origins for development and deployment flex
  credentials: true
}));

app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/vibes', vibesRoutes);
app.use('/api/search', searchRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Bloomora Express Backend Online' });
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Bloomora Express Server running on http://localhost:${port}`);
});
