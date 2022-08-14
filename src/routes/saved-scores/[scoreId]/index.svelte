<script context="module">
	import { supabase } from '$lib/supabaseClient.js';
	export async function load({ url, params }) {
		let { scoreId } = params;
		let score, ownerId, currentCard;
		let saved = url.pathname.includes('saved-scores');
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
				let { data, error } = await supabase
					.from('scores')
					.select('*')
					.eq('score_id', scoreId);
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
	import { page } from '$app/stores';
	import Score from '$c/Score.svelte';

	let { scoreId } = $page.params;
	let { score } = $page.stuff;
</script>

{#if score}
	<div class="font-bold mt-8">
		Welcome to score {scoreId}
	</div>
	<div class="flex flex-col items-center">
		<div class="my-8">
			<h2 class="text-xl font-bold ">Score</h2>
			<Score bind:score />
		</div>
	</div>
{:else}
	This score does not exist
{/if}
