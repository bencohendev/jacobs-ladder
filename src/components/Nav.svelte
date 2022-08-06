<script>
	import { goto } from '$app/navigation';

	import { user } from '$stores/user';
	import Button from '$c/Button.svelte';

	let links = [
		{
			label: 'Home',
			url: '/'
		}
	];
	console.log($user);
</script>

<div class="flex justify-between border">
	{#each links as link}
		{@const { url, label } = link}
		<div class="mr-8"><a class="text-blue-500" href={url}>{label}</a></div>
	{/each}
	<div>
		{#if $user.id === 'guest'}
			<div>
				<Button on:click={() => goto('/login')}>Sign In / Sign Up</Button>
			</div>
		{:else}
			<a href="/profile" sveltekit:prefetch><Button>Profile</Button></a>
			<a href="/saved-scores" sveltekit:prefetch
				><Button>Saved Scores</Button></a
			>
		{/if}
	</div>
</div>
