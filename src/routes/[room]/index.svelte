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

	const setScoreData = (data) => {
		data = data[0];
		ownerId = data?.owner_id;
		score = data?.cards || [];
		console.log('owner', ownerId, 'score', score);
	};

	const subscribe = () => {
		const scoreSubscription = supabase
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
			let { data, error } = await supabase
				.from('scores')
				.insert({ room_id: room, owner_id: $user.id });
			if (error) throw error;
			setScoreData(data);
			console.log(data, error);
		} catch (error) {
			console.error(error);
		}
	};
	const getScore = async () => {
		try {
			let { data, error } = await supabase.from('scores').select('*').eq('room_id', room);
			if (error) throw error;
			if (data.length === 0) {
				createScore();
			} else {
				setScoreData(data);
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
	<Score bind:score {currentCard} />
</div>
{#if $user && $user.id === ownerId && score.length > 0}
	<div>
		<Button on:click={() => currentCard++}>Next Card</Button>
	</div>
{/if}

<div class="my-4 flex flex-col items-center">
	<div class="mb-2">Add a new card to the score</div>
	<div>
		<Button on:click={() => (showAddCard = !showAddCard)}>
			{showAddCard ? 'Hide' : 'Click to add'}
		</Button>
	</div>
</div>
{#if showAddCard}
	<AddCard on:add={handleAdd} />
{/if}
