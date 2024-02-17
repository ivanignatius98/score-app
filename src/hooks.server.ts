import mongoose from 'mongoose';
import { DB_URI, SECRET_KEY } from '$env/static/private';
import jwt from 'jsonwebtoken';

console.log('Starting mongo...');
mongoose.connect(DB_URI);

import type { Handle, RequestEvent } from '@sveltejs/kit';
export const handle: Handle = async ({ event, resolve }) => {
	const { cookies } = event;
	const sessionId = cookies.get('session');
	let user = null;
	// before endpoint or page is called
	try {
		if (sessionId) {
			const temp = JSON.parse(sessionId);
			const decoded = await new Promise((resolve, reject) => {
				jwt.verify(temp.token, SECRET_KEY, (err, val) => {
					if (err) {
						console.error(err);
						resolve(null);
					}
					resolve(val);
				});
			});
			user = decoded;
		}
	} catch (error) {}
	if (!user) cookies.delete('session', { path: '/' });

	event.locals.user = user;
	const response = await resolve(event);

	// after endpoint or page is called

	return response;
};
