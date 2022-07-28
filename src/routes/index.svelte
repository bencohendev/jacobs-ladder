<script>
	import { goto } from '$app/navigation';
	import { user } from '*stores/user';
	import { supabase } from '*lib/supabaseClient';
	import Auth from '*lib/Auth.svelte';
	import Button from '*c/Button.svelte';

	user.set(supabase.auth.user());

	supabase.auth.onAuthStateChange((_, session) => {
		console.log('auth state change');
		user.set(session.user);
	});
	const handleCreateRoom = () => {
		const roomNumber = Math.floor(10000000 + Math.random() * 90000000);
		goto(`/${roomNumber}`);
	};
</script>

<div class="container w-full h-screen grid justify-center items-center place-content-center">
	{#if $user}
		<Button on:click={handleCreateRoom}>Create New Room</Button>
	{:else}
		<Auth />
	{/if}
</div>
