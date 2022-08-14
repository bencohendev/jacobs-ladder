<script>
	import { supabase } from '$lib/supabaseClient.js';
	import { goto } from '$app/navigation';
	import { user } from '$stores/user';
	import Auth from '$lib/Auth.svelte';
	import Button from '$c/Button.svelte';

	let scoreId;

	const handleGoToScore = () => {
		goto(`/${scoreId}`);
	};

	const handleCreateScore = () => {
		const newScoreId = Math.floor(10000000 + Math.random() * 90000000);
		createScore();
		goto(`/${newScoreId}`);
		async function createScore() {
			try {
				let { data, error } = await supabase
					.from('scores')
					.insert({ score_id: newScoreId, owner_id: $user.id });
				if (error) throw error;
			} catch (error) {
				console.error(error);
			}
		}
	};
</script>

<div class=" my-2">Welcome To Jacob's Ladder</div>
{#if $user.id !== 'guest'}
	<Button on:click={handleCreateScore}>Create New Score</Button>
{:else}
	<div class="my-2 flex justify-center">
		<div>Sign up/sign in to create a score</div>
		<Auth />
	</div>
{/if}
<div class="my-2 flex justify-center">- or -</div>
<div class="my-2">Enter a score number to join</div>
<input
	class="border border-gray rounded my-2"
	type="text"
	name="score-number"
	bind:value={scoreId}
/>
<Button on:click={handleGoToScore}>Join</Button>
