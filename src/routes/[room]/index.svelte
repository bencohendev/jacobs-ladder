<script>
	import { user } from '*stores/user';
	import { supabase } from '*lib/supabaseClient.js';
	import AddCard from '*c/AddCard.svelte';
	import Score from '*c/Score.svelte';
	import Button from '*c/Button.svelte';
	import { page } from '$app/stores';

	let { room } = $page.params;
	let { score, ownerId, currentCard } = $page.stuff;

	let showAddCard = false;

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

	const handleNextCard = async () => {
		try {
			const { data, error } = await supabase
				.from('scores')
				.update({ score_index: ++currentCard })
				.eq('room_id', room);
			console.log(currentCard);
			if (error) throw error;
			console.log(data, error);
		} catch (error) {
			console.error(error);
		}
	};

	const subscribe = async () => {
		const scoreSubscription = await supabase
			.from(`scores:room_id=eq.${room}`)
			.on('*', (payload) => {
				score = payload.new.cards;
				currentCard = payload.new.score_index;
				console.log('subscription update', payload);
			})
			.subscribe();
	};

	subscribe();
</script>

<div class="font-bold mt-8">
	Welcome to room {room}
</div>
<div class="flex flex-col items-center">
	<div class="my-8">
		<h2 class="text-xl font-bold ">Score</h2>
		<Score bind:score {currentCard} />
	</div>
	{#if $user && $user.id === ownerId && score.length > 1}
		<div>
			<Button
				disabled={currentCard === score.length - 1}
				on:click={handleNextCard}
			>
				Next Card
			</Button>
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
</div>
