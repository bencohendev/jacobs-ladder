<script context="module">
	import { user } from '$stores/user';
	import { supabase } from '$lib/supabaseClient';
	import DoUsername from 'do_username';

	export async function load() {
		let returnedUser = supabase.auth.user();
		if (returnedUser) {
			try {
				let { data, error, status } = await supabase
					.from('profiles')
					.select(`*`)
					.eq('id', returnedUser.id)
					.single();

				if (error && status !== 406) throw error;

				if (data) {
					returnedUser.username = data?.username;
					returnedUser.avatarURL = data?.avatar_url;
					returnedUser.pronouns = data?.pronouns;
				}
			} catch (error) {
				console.error(error.message);
			}
			return { stuff: { user: returnedUser } };
		} else {
			returnedUser = { id: 'guest', username: DoUsername.generate(15) };
		}
		user.set(returnedUser);
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
	console.log($user);
</script>

<div class="p-20">
	<Nav />

	<div class="mt-8 w-full  h-screen flex flex-col items-center">
		<div class="max-w-4xl flex flex-col items-center">
			<slot />
		</div>
	</div>
</div>
