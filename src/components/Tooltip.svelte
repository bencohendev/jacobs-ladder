<script>
	export let title = '';
	export let content = '';
</script>

<div class="border border-black p-1 bg-white">
	<slot name="title">{title}</slot>
	{#if content && title}
		<hr />
	{/if}
	<slot name="content">{content}</slot>
</div>
