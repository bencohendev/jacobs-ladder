<script context="module">
	import { user } from '*stores/user';
	import { supabase } from '*lib/supabaseClient';
	supabase.auth.onAuthStateChange((_, session) => {
		console.log('auth state change');
		user.set(session.user);
	});

	export async function load() {
		const returnedUser = supabase.auth.user();
		if (returnedUser) {
			user.set(returnedUser);
		} else {
			user.set({
				id: 'guest'
			});
		}
		return {};
	}
</script>

<script>
	import '../app.css';
	import Nav from '*c/Nav.svelte';
</script>

<div class="p-20">
	<Nav />
	<slot />
</div>
