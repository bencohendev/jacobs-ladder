<script>
	import { user } from '*stores/user';
	import { supabase } from '*lib/supabaseClient';
	import Auth from '*lib/Auth.svelte';
	import Profile from '*lib/Profile.svelte';

	user.set(supabase.auth.user());

	supabase.auth.onAuthStateChange((_, session) => {
		console.log('auth state change');
		user.set(session.user);
	});
	$: console.log($user);
</script>

<div
	class="container w-full h-screen grid justify-center items-center place-content-center"
>
	{#if $user}
		<Profile />
	{:else}
		<Auth />
	{/if}
</div>
