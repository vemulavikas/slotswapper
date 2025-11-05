const mongoose = require('mongoose');

async function connectDB(uri) {
  if (!uri) throw new Error('Missing MongoDB URI');
  // Use modern connection options
  return mongoose.connect(uri, {
    // keep options minimal; mongoose v8 uses sane defaults
    // bufferCommands: false // optional
  });
}

module.exports = { connectDB };
