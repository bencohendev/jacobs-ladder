<script>
	export let constrained = true;
</script>

<button
	class="shadow rounded border border-rose-800 p-2 {constrained ||
		'w-full'} hover:bg-rose-800 hover:text-white "
	on:click
>
	<slot name="left" />
	<slot />
	<slot name="right" />
</button>
