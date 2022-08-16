<script>
	export let score = [];
	export let currentCard;
</script>

<div class="flex h-32 mt-2">
	{#each score as card, i}
		{@const { rowOne, rowTwo, rowThree, name } = card}
		<div
			class="p-2 mx-2 border border-gray-300 {i === currentCard
				? 'bg-green-500'
				: ''} "
		>
			<div class="h-1/3 flex items-center">{rowThree ? rowThree : ''}</div>
			<hr />
			<div class="h-1/3 flex items-center">{rowTwo ? rowTwo : ''}</div>
			<hr />
			<div class="h-1/3 flex items-center">{rowOne}</div>
			<div>{name || ''}</div>
		</div>
	{:else}
		<div>Please add a card to get started</div>
	{/each}
</div>
