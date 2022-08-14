<script>
	import Score from '$c/Score.svelte';

	export let score, scoreId;
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
