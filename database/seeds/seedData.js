// Seed data for database initialization
// Run this file to populate the database with sample data

const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/greenorigin', {
      serverSelectionTimeoutMS: 15000,  // Tăng từ 8000 lên 15000
      socketTimeoutMS: 45000,           // Thêm option này
      maxPoolSize: 10,                  // Giới hạn connection pool
      family: 4
    });
    console.log('MongoDB connected for seeding...');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();
    
    console.log('Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Run seeding
seedData();

const User = require('./models/User');

app.get('/users', async (req, res) => {
    try {
        const users = await User.find();  // Bây giờ mới có collection users
        res.json(users);
    } catch (error) {
        console.error('getUsers error:', error);
        res.status(500).json({ error: error.message });
    }
});

User.find()
    .then(users => console.log('✅ Users found:', users.length))
    .catch(err => console.error('❌ Error:', err.message));
