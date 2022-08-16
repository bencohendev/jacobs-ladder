<script>
	export let score = [];
	export let currentCard;

	import UserIcon from '$c/UserIcon.svelte';
</script>

<div class="flex h-40 mt-2">
	{#each score as card, i}
		{@const { rowOne, rowTwo, rowThree, name } = card}
		<div
			class="p-2 mx-2 border border-gray-300 
			{i === currentCard ? 'bg-green-500' : ''} "
		>
			<div class="h-1/4 flex justify-center items-center">
				{rowThree ? rowThree : ''}
			</div>
			<hr />
			<div class="h-1/4 flex justify-center items-center">
				{rowTwo ? rowTwo : ''}
			</div>
			<hr />
			<div class="h-1/4 flex justify-center items-center">{rowOne}</div>
			<hr />

			<div class="h-1/4 mt-2"><UserIcon {name} /></div>
		</div>
	{:else}
		<div>Please add a card to get started</div>
	{/each}
</div>
