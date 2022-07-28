<script>
	import '../app.css';
	import Nav from '*c/Nav.svelte';
	import Auth from '*lib/Auth.svelte';
	import { user } from '*stores/user';
	import { supabase } from '*lib/supabaseClient';

	user.set(supabase.auth.user());

	supabase.auth.onAuthStateChange((_, session) => {
		console.log('auth state change');
		user.set(session.user);
	});
</script>

<div class="p-20">
	<Nav />
	{#if $user}
		<slot />
	{:else}
		<Auth />
	{/if}
</div>
