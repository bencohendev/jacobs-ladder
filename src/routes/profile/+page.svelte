<script>
	import { supabase } from '$lib/supabaseClient';
	import { user } from '$stores/user';
	import Avatar from '$c/Avatar.svelte';
	import Button from '$c/Button.svelte';

	let loading = false;
	let { username, pronouns, avatarURL, email } = $user;

	async function updateProfile() {
		try {
			loading = true;
			const user = supabase.auth.user();

			const updates = {
				id: user.id,
				username,
				avatar_url: avatarURL,
				pronouns,
				updated_at: new Date()
			};

			let { error } = await supabase.from('profiles').upsert(updates, {
				returning: 'minimal' // Don't return the value after inserting
			});

			if (error) throw error;
			console.log('huh');
		} catch (error) {
			alert(error.message);
		} finally {
			loading = false;
		}
	}

	async function signOut() {
		try {
			loading = true;
			let { error } = await supabase.auth.signOut();
			if (error) throw error;
		} catch (error) {
			alert(error.message);
		} finally {
			loading = false;
		}
	}
	console.log('user', $user);
</script>

<form on:submit|preventDefault={updateProfile}>
	<div class="my-2">
		<label for="email">Email</label>
		<input
			class="border border-gray-500 p-1 ml-1"
			id="email"
			type="text"
			value={email}
			disabled
		/>
	</div>
	<div class="my-2">
		<label for="username">Name</label>
		<input
			class="border border-gray-500 p-1 ml-1"
			id="username"
			type="text"
			bind:value={username}
		/>
	</div>
	<div class="my-2">
		<label for="pronouns">Pronouns</label>
		<input
			class="border border-gray-500 p-1 ml-1"
			id="pronouns"
			type="text"
			bind:value={pronouns}
		/>
	</div>
	<div class="flex justify-center">
		<input
			type="submit"
			class="border border-black my-6 p-2"
			value={loading ? 'Loading ...' : 'Update'}
			disabled={loading}
		/>
	</div>
</form>
<div>Profile Picture</div>
<form on:submit|preventDefault={updateProfile}>
	<!-- Add to body -->
	<Avatar bind:path={avatarURL} on:upload={updateProfile} />

	<!-- Other form elements -->
</form>
<div class="my-8">
	<Button on:click={signOut} disabled={loading}>Sign Out</Button>
</div>
