<script context="module">
	import { user } from '$stores/user';
	import { supabase } from '$lib/supabaseClient';

	export async function load() {
		let returnedUser = supabase.auth.user();
		returnedUser = returnedUser ? returnedUser : { id: 'guest' };

		try {
			let { data, error, status } = await supabase
				.from('profiles')
				.select(`*`)
				.eq('id', returnedUser.id)
				.single();

			if (error && status !== 406) throw error;

			if (data) {
				returnedUser.username = data?.username;
				returnedUser.avatar_url = data?.avatar_url;
				returnedUser.pronouns = data?.pronouns;
			}
		} catch (error) {
			console.error(error.message);
		}
		user.set(returnedUser);
		return { stuff: { user: returnedUser } };
	}
	const setAuthListener = () => {
		supabase.auth.onAuthStateChange((_, session) => {
			console.log('auth state change');
			user.set(session.user);
		});
	};
	setAuthListener();
</script>

<script>
	import '../app.css';
	import Nav from '$c/Nav.svelte';
	console.log('user', $user);
</script>

<div class="p-20">
	<Nav />

	<div class="mt-8 w-full  h-screen flex flex-col items-center">
		<div class="max-w-4xl flex flex-col items-center">
			<slot />
		</div>
	</div>
</div>
