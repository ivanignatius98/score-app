import mongoose from 'mongoose';
import { DB_URI } from '$env/static/private';

console.log('Starting mongo...');
mongoose.connect(DB_URI)