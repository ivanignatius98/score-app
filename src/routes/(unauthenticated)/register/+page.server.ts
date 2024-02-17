import type { Actions } from '@sveltejs/kit';
import { User } from '../../../models/User';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name');
		const password = formData.get('password');
		try {
			const user = await User.create({ name, password });
			return { success: true, user: JSON.parse(JSON.stringify(user)) };
		} catch (error) {
			console.error(error);
			return { success: false, user: null };
		}
	}
};
