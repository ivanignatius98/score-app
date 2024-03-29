import { redirect, type Actions } from '@sveltejs/kit';
import { User } from '../../../models/User';
import { SECRET_KEY } from '$env/static/private';

import jwt from 'jsonwebtoken';

const tokenExpiration = 60 * 60;
const refreshExpiration = 60 * 60 * 24;

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const name = formData.get('name');
		const password = formData.get('password');
		try {
			const user = await User.create({ name, password });

			const token = jwt.sign(user.toJSON(), SECRET_KEY, {
				expiresIn: tokenExpiration
			});
			const refreshToken = jwt.sign({}, SECRET_KEY, {
				expiresIn: refreshExpiration
			});
			Object.assign(user, { refresh_token: refreshToken });
			user.save();
			cookies.set('session', JSON.stringify({ token, refreshToken }), {
				httpOnly: true,
				path: '/'
			});
			throw redirect(302, '/');
		} catch (error) {
			console.error(error);
			return { success: false, user: null, message: 'Serverside ERROR' };
		}
	}
};
