<script context="module">
	import { supabase } from '*lib/supabaseClient.js';
	export async function load({ params, fetch, session, stuff }) {
		let { room } = params;
		let score, ownerId;

		const setScoreData = (data) => {
			data = data[0];
			ownerId = data?.owner_id;
			score = data?.cards || [];
		};
		const getScore = async () => {
			try {
				let { data, error } = await supabase.from('scores').select('*').eq('room_id', room);
				console.log(data, error);
				if (error) throw error;
				if (data) {
					setScoreData(data);
				}
			} catch (error) {
				console.error(error);
			}
		};
		await getScore();
		return {
			props: {
				ownerId,
				score
			},
			stuff: {
				ownerId,
				score
			}
		};
	}
</script>

<script>
	export let score;
</script>

{#if score}
	<slot />
{:else}
	this room does not exist
{/if}
