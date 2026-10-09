import { supabase } from '$lib/supabaseClient.js';
export async function load({ parent }) {
	let userId = (await parent()).user.id;
	let scores;

	let data = await getScores();
	scores = data;

	return {
		scores
	};

	async function getScores() {
		try {
			let { data, error } = await supabase
				.from('saved_scores')
				.select('cards, created_at, score_id')
				.eq('owner_id', userId);
			if (error) throw error;
			return data;
		} catch (error) {
			console.error(error);
		}
	}
}
