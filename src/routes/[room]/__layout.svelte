<script context="module">
	import { supabase } from '*lib/supabaseClient.js';
	export async function load({ params }) {
		let { room } = params;
		let score, ownerId, currentCard;

		let data = await getScore();
		if (data) {
			setScoreData(data);
		} else {
			score = null;
		}
		return {
			props: {
				ownerId,
				score
			},
			stuff: {
				ownerId,
				score,
				currentCard
			}
		};
		async function setScoreData(data) {
			data = data[0];
			ownerId = data?.owner_id;
			score = data?.cards;
			currentCard = data?.score_index || 0;
		}
		async function getScore() {
			try {
				let { data, error } = await supabase.from('scores').select('*').eq('room_id', room);
				console.log(data, error);
				if (error) throw error;
				return data;
			} catch (error) {
				console.error(error);
			}
		}
	}
</script>

<script>
	export let score;
</script>

{#if score}
	<slot />
{:else}
	this room does not exist
{/if}
