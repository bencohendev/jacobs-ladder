<script>
	export let score = [];
	export let currentCard;
</script>

<div class="flex">
	{#each score as card, i}
		{@const { rowOne, rowTwo, rowThree } = card}
		<div class="p-2 border border-gray-300 {i === currentCard ? 'bg-green-500' : ''} ">
			<div class="h-1/3">{rowThree ? rowThree : ''}</div>
			<hr />
			<div class="h-1/3">{rowTwo ? rowTwo : ''}</div>
			<hr />
			<div class="h-1/3">{rowOne}</div>
		</div>
	{:else}
		<div>Please add a card to get started</div>
	{/each}
</div>
