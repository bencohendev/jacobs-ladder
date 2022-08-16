<script>
	export let name = '';
	console.log('🚀 ~ file: UserIcon.svelte ~ line 3 ~ name', name);

	const firstLetter = name.charAt(0).toUpperCase();
</script>

{#if firstLetter}
	<div
		class="w-6 h-6 
      flex justify-center items-center
      border-2 border-blue-500 rounded-full
  "
	>
		<div class="relative">
			{firstLetter}
		</div>
	</div>
{/if}
