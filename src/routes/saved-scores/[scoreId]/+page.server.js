import { error } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient.js';

export async function load({ params }) {
	let { scoreId } = params;
	let score, ownerId, currentCard;
	let data = await getScore();
	if (data) {
		setScoreData(data);
	} else {
		score = null;
	}
	if (score) {
		return { score, scoreId, ownerId, currentCard };
	} else {
		error(404, `This is not the score you're looking for`);
	}

	//------------Functions
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
