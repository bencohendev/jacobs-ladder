<script>
	import { createEventDispatcher } from 'svelte';
	import Button from '$c/Button.svelte';
	let rowThree, rowTwo, rowOne;

	const dispatch = createEventDispatcher();

	const handleClick = () => {
		dispatch('add', { rowOne, rowTwo, rowThree });
		rowOne = null;
	};

	$: {
		if (!rowOne) {
			rowTwo = null;
			rowThree = null;
		}
	}
	$: {
		if (!rowTwo) {
			rowThree = null;
		}
	}
</script>

<div class="w-full flex flex-col items-center">
	<div
		class="w-20 my-2 flex flex-col items-center border border-black rounded "
	>
		<div class="my-2 w-14 ">
			<input
				class="w-full border border-black rounded disabled:bg-slate-400 "
				type="number"
				min="1"
				name="3"
				bind:value={rowThree}
				disabled={!rowTwo}
			/>
		</div>
		<hr />
		<div class="my-2 w-14">
			<input
				class="w-full border border-black rounded disabled:bg-slate-400 "
				type="number"
				min="1"
				name="2"
				bind:value={rowTwo}
				disabled={!rowOne}
			/>
		</div>
		<hr />
		<div class="my-2 w-14">
			<input
				class="w-full border border-black rounded "
				type="number"
				min="1"
				name="1"
				bind:value={rowOne}
			/>
		</div>
	</div>
	<div>
		<Button on:click={handleClick}>Add Card</Button>
	</div>
</div>
