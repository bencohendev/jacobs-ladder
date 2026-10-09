<script>
	export let data;

	let scores = (data.scores ?? []).map((score) => {
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
