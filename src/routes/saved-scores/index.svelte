<script context="module">
	import { supabase } from '$lib/supabaseClient.js';
	export async function load({ stuff }) {
		let userId = stuff.user.id;
		let scores;

		let data = await getScores();
		scores = data;

		return {
			props: {
				scores
			}
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
</script>

<script>
	export let scores = [];

	scores = scores.map((score) => {
		let d = new Date(score.created_at);
		d = `${d.getMonth()}/${d.getDate()}/${d.getFullYear()}`;
		return {
			createdOn: d,
			cards: score.cards,
			scoreId: score.score_id
		};
	});
</script>

{#each scores as score}
	<div class="flex justify-between gap-2 items-center">
		<div>{score.createdOn}</div>
		<a href="./saved-scores/{score.scoreId}" class="text-blue-700">Show Score</a
		>
	</div>
{:else}
	<div>No Saved Scores</div>
{/each}
