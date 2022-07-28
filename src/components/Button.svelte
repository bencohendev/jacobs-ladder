<script>
	export let constrained = true;
	export let disabled = false;
</script>

<button
	class="shadow rounded border border-rose-800 p-2 {constrained ||
		'w-full'} hover:bg-rose-800 hover:text-white 
		disabled:bg-gray-400 disabled:hover:text-black 
		disabled:cursor-not-allowed"
	on:click
	{disabled}
>
	<slot name="left" />
	<slot />
	<slot name="right" />
</button>
