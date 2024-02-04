export const saveAction = async (payload: any) => {
	try {
		const response = await fetch('/api/users', {
			method: 'POST',
			body: JSON.stringify(payload),
			headers: {
				'content-type': 'application/json'
			}
		});

		return response.json();
	} catch (error) {
		console.error('Error submitting form', error);
		return { success: false };
	}
};

export const deleteAction = async (_id: string) => {
	try {
		const response = await fetch('/api/users', {
			method: 'DELETE',
			body: JSON.stringify({ _id }),
			headers: {
				'content-type': 'application/json'
			}
		});

		return response.json();
	} catch (error) {
		console.error('Error submitting form', error);
		return { success: false };
	}
};
