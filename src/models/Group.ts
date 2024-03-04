import mongoose, { Schema } from 'mongoose';

// Define a schema for the Users
const GroupSchema = new mongoose.Schema({
	name: String,
	members:[{
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }]
}, {
  timestamps: true
});
export const Group = mongoose.model('Group', GroupSchema);
