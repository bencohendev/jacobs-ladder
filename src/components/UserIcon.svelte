<script>
	export let name = '';

	import { user } from '$stores/user';
	import { supabase } from '$lib/supabaseClient';

	const firstLetter = name.charAt(0).toUpperCase();
	const { avatarURL } = $user;
	let src;

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

	if (avatarURL) downloadImage();
</script>

<div
	class="w-6 h-6 
flex justify-center items-center
border-2 border-blue-500 rounded-full
"
>
	<div class="relative">
		{#if src}
			<img {src} alt="Avatar" style="height: 10px; width: 10px;" />
		{:else}
			<div>{firstLetter}</div>
		{/if}
	</div>
</div>
