<script>
	export let userId = '';

	import { supabase } from '$lib/supabaseClient';
	import Tooltip from '$c/Tooltip.svelte';
	const regexExp =
		/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

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
				.eq('id', userId)
				.single();

			if (error && status !== 406) throw error;

			if (data) {
				firstLetter = data?.username.charAt(0).toUpperCase();
				avatarURL = data?.avatar_url;
				username = data?.username;
			}
		} catch (error) {
			console.log(userId);

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

	const init = () => {
		if (regexExp.test(userId)) {
			getProfile();
		} else {
			username = userId;
			firstLetter = userId.charAt(0).toUpperCase();
		}
	};
	init();
	$: if (avatarURL) downloadImage();
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
		<div class="relative left-8 bottom-8 z-10">
			<div class="absolute">
				<Tooltip title={'User'} content={username} />
			</div>
		</div>
	{/if}
	<div class="relative cursor-pointer">
		{#if src}
			<img {src} alt="Avatar" style="height: 10px; width: 10px;" />
		{:else}
			<div>{firstLetter}</div>
		{/if}
	</div>
</div>
