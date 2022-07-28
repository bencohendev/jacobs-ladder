<script>
	import { createEventDispatcher } from 'svelte';
	import Button from '*c/Button.svelte';
	let rowThree, rowTwo, rowOne;
	let disableTwo = true;
	let disableThree = true;

	const dispatch = createEventDispatcher();

	const handleClick = () => {
		dispatch('add', { rowOne, rowTwo, rowThree });
	};

	$: {
		if (rowOne) {
			disableTwo = false;
		}
	}
	$: {
		if (rowTwo) {
			disableThree = false;
		}
	}
</script>

<div>
	<div>
		<input
			class="border border-black disabled:bg-slate-400"
			type="number"
			name="3"
			bind:value={rowThree}
			disabled={disableThree}
		/>
	</div>
	<hr />
	<div>
		<input
			class="border border-black disabled:bg-slate-400"
			type="number"
			name="2"
			bind:value={rowTwo}
			disabled={disableTwo}
		/>
	</div>
	<hr />
	<div>
		<input class="border border-black" type="number" name="1" bind:value={rowOne} />
	</div>
</div>
<div>
	<Button on:click={handleClick}>Add Card</Button>
</div>
