
export const matchSummary = async (_id: string) => {
  try {
    const response = await fetch(`/api/series/${_id}/matches-summary`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      }
    });

    return response.json();
  } catch (error) {
    console.error('Error submitting form', error);
    return { success: false }
  }
};
