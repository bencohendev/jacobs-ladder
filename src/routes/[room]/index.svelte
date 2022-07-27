<script>
	import { page } from '$app/stores';
	import { supabase } from '*lib/supabaseClient.js';
	import Card from '*c/Card.svelte';

	let { room } = $page.params;
	const subscribe = () => {
		const mySubscription = supabase
			.from('scores')
			.on('*', (payload) => {
				console.log('Change received!', payload);
			})
			.subscribe();
	};
	//subscribe();
	const handleAdd = (e) => {
		console.log(e);
	};
</script>

<div>
	Welcome to room {room}
</div>
<div>
	<Card on:add={handleAdd} />
</div>
