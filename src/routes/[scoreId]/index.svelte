<script>
	import monitorAwareness from '$lib/awareness';
	import { user } from '$stores/user';
	import Button from '$c/Button.svelte';
	import Modal from '$c/Modal.svelte';
	import AddCard from '$c/AddCard.svelte';
	import Score from '$c/Score.svelte';
	import Toast from '$c/Toast.svelte';
	import { onMount } from 'svelte';

	export let score, scoreId, currentCard;
	export let ownerId = $user.id;
	let addCard = false;
	let saveModal = false;
	let resetModal = false;
	let toast = false;

	const handleAdd = async (e) => {
		const card = e.detail;
		try {
			const { data, error } = await supabase
				.from('scores')
				.update({ cards: [...score, card] })
				.eq('score_id', scoreId);

			if (error) throw error;
			addCard = false;
		} catch (error) {
			console.error(error);
		}
	};

	const handleNextCard = async () => {
		try {
			const { data, error } = await supabase
				.from('scores')
				.update({ score_index: ++currentCard })
				.eq('score_id', scoreId);
			if (error) throw error;
		} catch (error) {
			console.error(error);
		}
	};

	const handleSave = async () => {
		try {
			const { data, error } = await supabase
				.from('saved_scores')
				.insert({ cards: score, owner_id: ownerId, score_id: scoreId });

			if (error) throw error;
		} catch (error) {
			console.error(error);
		} finally {
			showSave = false;
		}
	};

	const handleReset = async () => {
		try {
			const { data, error } = await supabase
				.from('scores')
				.update({ cards: [] })
				.eq('score_id', scoreId);

			if (error) throw error;
		} catch (error) {
			console.error(error);
		} finally {
			resetModal = false;
		}
	};

	const subscribe = async () => {
		supabase
			.from(`scores:score_id=eq.${scoreId}`)
			.on('*', (payload) => {
				score = payload.new.cards;
				currentCard = payload.new.score_index;
			})
			.subscribe();
	};

	subscribe();

	onMount(() => {
		monitorAwareness(scoreId, $user.email);
	});
</script>

{#if score}
	<div class="font-bold mt-8">
		Score: {scoreId}
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
				<Button on:click={() => (addCard = !addCard)}>
					{addCard ? 'Hide' : 'Click to add'}
				</Button>
			</div>
		</div>
		{#if addCard}
			<AddCard on:add={handleAdd} />
		{/if}

		<div class="mt-4">
			<Button on:click={() => (saveModal = true)}>Save Score</Button>
		</div>
		<Modal show={saveModal} on:click_outside={() => (saveModal = false)}>
			<div class="text-center">Are you sure you want to save?</div>
			<div class="my-8 flex flex-row justify-around">
				<Button on:click={() => (saveModal = false)}>Close</Button>
				<Button on:click={handleSave}>Yes</Button>
			</div>
		</Modal>
	</div>
	<div class="mt-4">
		<Button on:click={() => (resetModal = true)}>Reset Score</Button>
		<Modal show={resetModal} on:click_outside={() => (resetModal = false)}>
			<div class="text-center">Are you sure you want to reset?</div>
			<div class="my-8 flex flex-row justify-around">
				<Button on:click={() => (resetModal = false)}>Close</Button>
				<Button on:click={handleReset}>Yes</Button>
			</div>
		</Modal>
	</div>
{:else}
	This score does not exist
{/if}
<Toast bind:toast message={'this is a toast message'} />
