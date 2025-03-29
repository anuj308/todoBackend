import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import todoRoutes from './routes/todoRoutes.js';
import noteRoutes from './routes/noteRoutes.js'; // Import note routes

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/todos', todoRoutes);
app.use('/api/notes', noteRoutes); // Add note routes

// 404 handler for API routes
app.all('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Root route for API status
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Todo and Notes API server is running',
    version: '1.0.0'
  });
});

// Ensure the database connection is established before starting the server
(async () => {
  try {
    await connectDB();
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
})();