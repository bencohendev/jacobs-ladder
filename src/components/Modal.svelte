<script>
	export let show = false;

	import { clickOutside } from '*lib/helpers.js';
</script>

{#if show}
	<div
		class="absolute top-0 left-0 w-screen h-screen bg-slate-500 opacity-25"
	/>
	<div
		use:clickOutside
		on:click_outside
		class="absolute inset-1/4 border border-black bg-white p-20"
	>
		<slot />
	</div>
{/if}
