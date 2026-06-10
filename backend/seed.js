require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const WaterRecord = require('./models/WaterRecord');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Admin user
  const admin = await User.findOneAndUpdate(
    { email: 'admin@aquasense.ai' },
    { name: 'Admin User', email: 'admin@aquasense.ai', password: 'admin123', role: 'admin' },
    { upsert: true, new: true }
  );

  // Demo user
  const user = await User.findOneAndUpdate(
    { email: 'demo@aquasense.ai' },
    { name: 'Aryan Kumar', email: 'demo@aquasense.ai', password: 'demo123', role: 'user', organization: 'IIT Lucknow' },
    { upsert: true, new: true }
  );

  // Generate 60 days of sample water records
  const locations = ['Block A, Floor 1', 'Block A, Floor 2', 'Cafeteria', 'Block B', 'Sports Complex', 'Admin Block'];
  const depts = ['Facilities', 'Cafeteria', 'Sports', 'Administration', 'Hostel'];
  const records = [];
  for (let i = 60; i >= 0; i--) {
    const date = new Date(); date.setDate(date.getDate() - i);
    const baseUsage = 2500 + Math.sin(i * 0.3) * 400;
    const noise = (Math.random() - 0.5) * 800;
    const spike = Math.random() < 0.05 ? Math.random() * 2000 : 0; // 5% chance of spike
    records.push({
      userId: user._id,
      date, liters: Math.max(500, Math.round(baseUsage + noise + spike)),
      location: locations[Math.floor(Math.random() * locations.length)],
      department: depts[Math.floor(Math.random() * depts.length)],
      notes: spike > 0 ? 'Unusual spike detected' : '',
    });
  }
  await WaterRecord.deleteMany({ userId: user._id });
  await WaterRecord.insertMany(records);

  console.log('Seed complete!');
  console.log('Admin: admin@aquasense.ai / admin123');
  console.log('Demo:  demo@aquasense.ai  / demo123');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
