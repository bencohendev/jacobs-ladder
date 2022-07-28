<script>
	import { user } from '*stores/user';
	import { page } from '$app/stores';
	import { supabase } from '*lib/supabaseClient.js';
	import AddCard from '*c/AddCard.svelte';
	import Score from '*c/Score.svelte';
	import Button from '*c/Button.svelte';

	let { room } = $page.params;
	let score = [];
	let currentCard = 0;
	let ownerId;
	let showAddCard = false;

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
			const { data, error } = await supabase
				.from('scores')
				.insert({ room_id: room, owner_id: $user.id });
			if (error) throw error;
			console.log(data, error);
		} catch (error) {
			console.error(error);
		}
	};
	const getScore = async () => {
		try {
			let { data, error } = await supabase.from('scores').select('*').eq('room_id', room);
			console.log(data, error);
			if (error) throw error;
			if (data.length === 0) {
				createScore();
			} else {
				data = data[0];
				score = data?.cards || [];
				ownerId = data?.owner_id;
				console.log('🚀 ~ file: index.svelte ~ line 49 ~ getScore ~ score', score);
			}
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

<div class="my-8">
	<h2 class="text-xl font-bold ">Score</h2>
	<Score {score} {currentCard} />
</div>

{#if $user && $user.id === ownerId}
	<div>
		<Button on:click={() => currentCard++}>Next Card</Button>
	</div>
{/if}

<div>
	<div>Add a new card to the score</div>
	<div>
		<Button on:click={() => (showAddCard = !showAddCard)}>
			{showAddCard ? 'Hide' : 'Click to add'}
		</Button>
	</div>
</div>
{#if showAddCard}
	<div>
		<AddCard on:add={handleAdd} />
	</div>
{/if}
