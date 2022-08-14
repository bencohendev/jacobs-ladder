import { supabase } from '$lib/supabaseClient.js';

export async function GET({ params }) {
	let { scoreId } = params;
	let score, ownerId, currentCard;
	let data = await getScore();
	if (data) {
		setScoreData(data);
	} else {
		score = null;
	}
	if (score) {
		return {
			status: 200,
			header: {},
			body: { score, scoreId, ownerId, currentCard }
		};
	} else {
		return {
			status: 404
		};
	}

	//--------- Functions
	async function setScoreData(data) {
		data = data[0];
		ownerId = data?.owner_id;
		score = data?.cards;
		currentCard = data?.score_index || 0;
	}
	async function getScore() {
		try {
			let { data, error } = await supabase
				.from('scores')
				.select('*')
				.eq('score_id', scoreId);
			if (error) throw error;
			return data;
		} catch (error) {
			console.error(error);
		}
	}
}
