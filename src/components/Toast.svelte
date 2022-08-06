<script>
	export let message = '';
	export let toast = false;
	import { fade } from 'svelte/transition';
</script>

{#if toast}
	<div
		class="absolute bottom-2 right-5 text-white bg-gray-800 p-3 shadow-lg rounded-lg"
		transition:fade|local={{ delay: 150, duration: 200 }}
	>
		<div class="flex relative mb-1">
			<slot>{message}</slot>
			<div class="ml-2 cursor-pointer" on:click={() => (toast = false)}>X</div>
		</div>
	</div>
{/if}
