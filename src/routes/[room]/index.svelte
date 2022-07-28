<script>
	import { user } from '*stores/user';
	import { supabase } from '*lib/supabaseClient.js';
	import AddCard from '*c/AddCard.svelte';
	import Score from '*c/Score.svelte';
	import Button from '*c/Button.svelte';
	import { page } from '$app/stores';

	let { room } = $page.params;
	let { score } = $page.stuff;
	let currentCard = 0;
	let ownerId;
	let showAddCard = false;

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

	subscribe();
	console.log(score, $page);
</script>

<div class="font-bold mt-8">
	Welcome to room {room}
</div>
<div class="flex flex-col items-center">
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
</div>
