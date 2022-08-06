<script context="module">
	import { supabase } from '$lib/supabaseClient.js';
	export async function load({ stuff }) {
		let userId = stuff.user.id;
		let scores;

		let data = await getScores();
		console.log('🚀 ~ file: index.svelte ~ line 8 ~ load ~ data', data);
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
					.select('cards, created_at, room_id')
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

	import Button from '*c/Button.svelte';

	scores = scores.map((score) => {
		let d = new Date(score.created_at);
		d = `${d.getMonth()}/${d.getDate()}/${d.getFullYear()}`;
		return {
			createdOn: d,
			cards: score.cards,
			room: score.room_id
		};
	});
	console.log(
		'🚀 ~ file: saved-scores.svelte ~ line 47 ~ scores=scores.map ~ scores',
		scores
	);
</script>

{#each scores as score}
	<div class="flex justify-between gap-2 items-center">
		<div>{score.createdOn}</div>
		<a href="./saved-scores/{score.room}" class="text-blue-700">Show Score</a>
	</div>
{:else}
	<div>No Saved Scores</div>
{/each}
