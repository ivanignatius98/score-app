import { redirect } from '@sveltejs/kit';

export const GET = async ({ locals, cookies }) => {
	cookies.delete('session', { path: '/' });
	throw redirect(302, '/login');
};
