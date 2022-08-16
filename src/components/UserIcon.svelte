<script>
	export let user = '';

	import { supabase } from '$lib/supabaseClient';
	import Tooltip from '$c/Tooltip.svelte';

	let firstLetter = '';
	let src;
	let tooltip = false;
	let avatarURL;
	let username = '';

	const getProfile = async () => {
		try {
			let { data, error, status } = await supabase
				.from('profiles')
				.select(`*`)
				.eq('id', user)
				.single();

			if (error && status !== 406) throw error;

			if (data) {
				firstLetter = data?.username.charAt(0).toUpperCase();
				avatarURL = data?.avatar_url;
				username = data?.username;
			}
		} catch (error) {
			console.log(user);
			username = user;
			firstLetter = user.charAt(0).toUpperCase();
			console.error(error.message);
		}
	};

	async function downloadImage() {
		try {
			const { data, error } = await supabase.storage
				.from('avatars')
				.download(avatarURL);
			if (error) throw error;

			src = URL.createObjectURL(data);
		} catch (error) {
			console.error('Error downloading image: ', error.message);
		}
	}

	const showTooltip = () => {
		tooltip = true;
	};
	const hideTooltip = () => {
		tooltip = false;
	};

	$: if (avatarURL) downloadImage();
	getProfile();
</script>

<div
	class="w-6 h-6 
flex justify-center items-center
border-2 border-blue-500 rounded-full
"
	on:mouseenter={showTooltip}
	on:mouseleave={hideTooltip}
>
	{#if tooltip}
		<div class="relative left-8 bottom-8">
			<div class="absolute">
				<Tooltip title={'User'} content={username} />
			</div>
		</div>
	{/if}
	<div class="relative">
		{#if src}
			<img {src} alt="Avatar" style="height: 10px; width: 10px;" />
		{:else}
			<div>{firstLetter}</div>
		{/if}
	</div>
</div>
