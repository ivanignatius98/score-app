import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
export const load: LayoutServerLoad = ({ locals }) => {
	const { user } = locals;
	if (user) {
		throw redirect(302, '/');
	}
	return;
};
