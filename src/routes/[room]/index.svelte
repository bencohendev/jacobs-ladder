<script>
	import { user } from '*stores/user';
	import { page } from '$app/stores';
	import { supabase } from '*lib/supabaseClient.js';
	import Card from '*c/Card.svelte';
	import Button from '*c/Button.svelte';

	let { room } = $page.params;
	let score = [];
	let currentCard = 0;

	const subscribe = () => {
		const mySubscription = supabase
			.from(`scores:room_id=eq.${room}`)
			.on('*', (payload) => {
				score = payload.new.cards;
				console.log('🚀 ~ file: index.svelte ~ line 15 ~ .on ~ score', payload);
			})
			.subscribe();
	};
	//subscribe();
	const handleAdd = async (e) => {
		const card = e.detail;
		console.log('🚀 ~ file: index.svelte ~ line 21 ~ handleAdd ~ card', card);
		try {
			const { data, error } = await supabase
				.from('scores')
				.update({ cards: [...score, card] })
				.eq('room_id', room);

			if (error) throw error;
			console.log(data, error);
		} catch (error) {
			console.error(error);
		}
	};

	const createScore = async () => {
		try {
			const { data, error } = await supabase.from('scores').insert({ room_id: room });
			if (error) throw error;
			console.log(data, error);
		} catch (error) {
			console.error(error);
		}
	};
	const getScore = async () => {
		try {
			const { data, error } = await supabase.from('scores').select('*').eq('room_id', room);
			console.log(data, error);
			score = [...data][0]?.cards ?? [];
			console.log('🚀 ~ file: index.svelte ~ line 49 ~ getScore ~ score', score);
			if (error) throw error;
			if (data.length === 0) createScore();
		} catch (error) {
			console.error(error);
		} finally {
			subscribe();
		}
	};
	getScore();
</script>

<div>
	Welcome to room {room}
</div>
<div>
	<Card on:add={handleAdd} />
</div>

<div>
	<h1 class="font-lg">Score</h1>
	<div class="flex">
		{#each score as card, i}
			<div class="p-2 border border-gray-300 {i === currentCard ? 'bg-green-500' : ''} ">
				<div class="h-1/3">{card.rowThree ? card.rowThree : ''}</div>
				<hr />
				<div class="h-1/3">{card.rowTwo ? card.rowThree : ''}</div>
				<hr />
				<div class="h-1/3">{card.rowOne}</div>
			</div>
		{/each}
	</div>
</div>

<div>
	<Button on:click={() => currentCard++}>Next Card</Button>
</div>
