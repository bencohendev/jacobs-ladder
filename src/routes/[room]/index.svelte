<script>
	import { page } from '$app/stores';
	import { supabase } from '*lib/supabaseClient.js';
	import { user } from '*stores/user';
	import Button from '*c/Button.svelte';
	import Modal from '*c/Modal.svelte';
	import AddCard from '*c/AddCard.svelte';
	import Score from '*c/Score.svelte';

	let { room } = $page.params;
	let { score, ownerId, currentCard } = $page.stuff;

	let showAddCard = false;
	let showSaveModal = false;

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

	const handleSave = async () => {
		try {
			const { data, error } = await supabase
				.from('saved_scores')
				.insert({ cards: score, owner_id: ownerId });

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
	<Button on:click={() => (showSaveModal = true)}>Save Score</Button>
</div>

<Modal show={showSaveModal} on:click_outside={() => (showSaveModal = false)}>
	<div class="text-center">Are you sure you want to save?</div>
	<div class="my-8 flex flex-row justify-around">
		<Button on:click={() => (showSaveModal = false)}>Close</Button>
		<Button on:click={handleSave}>Yes</Button>
	</div>
</Modal>
