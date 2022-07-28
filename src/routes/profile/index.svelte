<script>
	import { supabase } from '*lib/supabaseClient';
	import { user } from '*stores/user';
	import Avatar from '*lib/Avatar.svelte';
	import Button from '*c/Button.svelte';

	let loading = true;
	let username = null;
	let pronouns = null;
	let avatar_url = null;

	async function getProfile() {
		try {
			loading = true;
			const user = supabase.auth.user();

			let { data, error, status } = await supabase
				.from('profiles')
				.select(`*`)
				.eq('id', user.id)
				.single();

			if (error && status !== 406) throw error;

			if (data) {
				username = data?.username;
				avatar_url = data?.avatar_url;
				pronouns = data?.pronouns;
			}
		} catch (error) {
			alert(error.message);
		} finally {
			loading = false;
		}
	}

	async function updateProfile() {
		try {
			loading = true;
			const user = supabase.auth.user();

			const updates = {
				id: user.id,
				username,
				avatar_url,
				pronouns,
				updated_at: new Date()
			};

			let { error } = await supabase.from('profiles').upsert(updates, {
				returning: 'minimal' // Don't return the value after inserting
			});

			if (error) throw error;
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
</script>

<form use:getProfile on:submit|preventDefault={updateProfile}>
	<div>
		<label for="email">Email</label>
		<input class="border border-gray-500" id="email" type="text" value={$user.email} disabled />
	</div>
	<div>
		<label for="username">Name</label>
		<input class="border border-gray-500" id="username" type="text" bind:value={username} />
	</div>
	<div>
		<label for="pronouns">Pronouns</label>
		<input class="border border-gray-500" id="pronouns" type="text" bind:value={pronouns} />
	</div>
	<div>
		<input
			type="submit"
			class="border border-black my-6"
			value={loading ? 'Loading ...' : 'Update'}
			disabled={loading}
		/>
	</div>
</form>

<form use:getProfile on:submit|preventDefault={updateProfile}>
	<!-- Add to body -->
	<Avatar bind:path={avatar_url} on:upload={updateProfile} />

	<!-- Other form elements -->
</form>
<div>
	<Button on:click={signOut} disabled={loading}>Sign Out</Button>
</div>
