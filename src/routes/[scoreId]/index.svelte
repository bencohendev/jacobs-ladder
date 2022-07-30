<script context="module">
	import { supabase } from '*lib/supabaseClient.js';
	export async function load({ url, params }) {
		let { scoreId } = params;
		let score, ownerId, currentCard;
		let saved = url.pathname.includes('saved-scores');
		let data = await getScore();
		if (data) {
			setScoreData(data);
		} else {
			score = null;
		}
		console.log('params', saved, { params });
		return {
			props: {
				ownerId,
				score
			},
			stuff: {
				ownerId,
				score,
				currentCard
			}
		};
		async function setScoreData(data) {
			data = data[0];
			ownerId = data?.owner_id;
			score = data?.cards;
			currentCard = data?.score_index || 0;
		}
		async function getScore() {
			try {
				let { data, error } = await supabase
					.from('scores')
					.select('*')
					.eq('room_id', scoreId);
				console.log(data, error);
				if (error) throw error;
				return data;
			} catch (error) {
				console.error(error);
			}
		}
	}
</script>

<script>
	import { page } from '$app/stores';
	import { user } from '*stores/user';
	import Button from '*c/Button.svelte';
	import Modal from '*c/Modal.svelte';
	import AddCard from '*c/AddCard.svelte';
	import Score from '*c/Score.svelte';

	let { scoreId } = $page.params;
	let { score, currentCard } = $page.stuff;
	let ownerId = $user.id;
	let showAddCard = false;
	let showSaveModal = false;

	const handleAdd = async (e) => {
		const card = e.detail;
		try {
			const { data, error } = await supabase
				.from('scores')
				.update({ cards: [...score, card] })
				.eq('room_id', scoreId);

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
				.eq('room_id', scoreId);
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
				.insert({ cards: score, owner_id: ownerId, room_id: scoreId });

			if (error) throw error;
			console.log(data, error);
		} catch (error) {
			console.error(error);
		}
	};

	const subscribe = async () => {
		const scoreSubscription = await supabase
			.from(`scores:room_id=eq.${scoreId}`)
			.on('*', (payload) => {
				score = payload.new.cards;
				currentCard = payload.new.score_index;
				console.log('subscription update', payload);
			})
			.subscribe();
	};

	subscribe();
</script>

{#if score}
	<div class="font-bold mt-8">
		Welcome to room {scoreId}
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
			<div>Add a new card to the score</div>
			<div class="mt-4">
				<Button on:click={() => (showAddCard = !showAddCard)}>
					{showAddCard ? 'Hide' : 'Click to add'}
				</Button>
			</div>
		</div>
		{#if showAddCard}
			<AddCard on:add={handleAdd} />
		{/if}
		<div class="mt-4">
			<Button on:click={() => (showSaveModal = true)}>Save Score</Button>
		</div>
	</div>

	<Modal show={showSaveModal} on:click_outside={() => (showSaveModal = false)}>
		<div class="text-center">Are you sure you want to save?</div>
		<div class="my-8 flex flex-row justify-around">
			<Button on:click={() => (showSaveModal = false)}>Close</Button>
			<Button on:click={handleSave}>Yes</Button>
		</div>
	</Modal>
{:else}
	This room does not exist
{/if}
