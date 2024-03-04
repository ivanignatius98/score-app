import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define a schema for the Users
const UserSchema = new mongoose.Schema({
	name: String,
	password: {
		type: String,
		select: false // Exclude by default
	},
  groupIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Group',
    default: []
  }],
});

UserSchema.pre('save', function (next) {
	const user = this;
	if (this.isModified('password') || this.isNew) {
		bcrypt.genSalt(10, function (saltError, salt) {
			if (saltError) {
				return next(saltError);
			} else {
				bcrypt.hash(user.password, salt, function (hashError, hash) {
					if (hashError) {
						return next(hashError);
					}
					user.password = hash;
					next();
				});
			}
		});
	} else {
		return next();
	}
});
UserSchema.methods.comparePassword = function (password: string) {
	return new Promise(async (resolve) => {
		try {
			const valid = await bcrypt.compare(password, this.password);
			resolve(valid);
		} catch (error) {
			resolve(false);
		}
	});
};
// Create User model
export const User = mongoose.model('User', UserSchema);
