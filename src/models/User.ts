import mongoose, { Schema, Document } from 'mongoose';
// Define a schema for the Users
const UserSchema = new mongoose.Schema({
  name: String,
  password: {
    type: String,
    select: false, // Exclude by default
  },
});

// Create User model
export const User = mongoose.model('User', UserSchema);