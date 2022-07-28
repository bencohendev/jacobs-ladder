<script>
	import { supabase } from '*lib/supabaseClient.js';
	import { goto } from '$app/navigation';
	import { user } from '*stores/user';
	import Auth from '*lib/Auth.svelte';
	import Button from '*c/Button.svelte';

	let roomNumber;

	const handleJoinRoom = () => {
		goto(`/${roomNumber}`);
	};

	const handleCreateRoom = () => {
		const newRoomNumber = Math.floor(10000000 + Math.random() * 90000000);
		createScore();
		goto(`/${newRoomNumber}`);
		async function createScore() {
			try {
				let { data, error } = await supabase
					.from('scores')
					.insert({ room_id: newRoomNumber, owner_id: $user.id });
				if (error) throw error;
				console.log(data, error);
			} catch (error) {
				console.error(error);
			}
		}
	};
</script>

<div class="mt-8 w-full h-screen flex flex-col  ">
	<div class="my-2 flex justify-center">Welcome To Jacob's Ladder</div>
	{#if $user.id !== 'guest'}
		<Button on:click={handleCreateRoom}>Create New Room</Button>
	{:else}
		<div class="my-2 flex justify-center">
			<div>Sign up/sign in to create a room</div>
			<Auth />
		</div>
	{/if}
	<div class="my-2 flex justify-center">- or -</div>
	<div class="my-2">Enter a room number to join</div>
	<input
		class="border border-gray rounded my-2"
		type="text"
		name="room-number"
		bind:value={roomNumber}
	/>
	<Button on:click={handleJoinRoom}>Join</Button>
</div>
