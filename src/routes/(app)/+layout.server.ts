import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
export const load: LayoutServerLoad = ({ locals, cookies }) => {
	const { user } = locals; // locals.user set by hooks.server.ts/handle(), undefined if not logged in

	if (!user) {
		throw redirect(302, '/login');
	}

	return {
		user
	};
};
