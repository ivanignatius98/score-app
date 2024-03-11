export const saveAction = async (payload: any) => {
	try {
		const response = await fetch('/api/scoring', {
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
		const response = await fetch('/api/scoring', {
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

interface matchPayload {
	_id: string;
	status: string;
	aPoints: number;
	bPoints: number;
}
export const updateMatchStatus = async ({ _id, ...rest }: matchPayload) => {
	try {
		const response = await fetch(`/api/scoring/${_id}/update-status`, {
			method: 'POST',
			body: JSON.stringify(rest),
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
