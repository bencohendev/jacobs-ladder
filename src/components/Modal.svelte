<script>
	export let show = false;
</script>

{#if show}
	<div>
		<slot />
	</div>
{/if}
