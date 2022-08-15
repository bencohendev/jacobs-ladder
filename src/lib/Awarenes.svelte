<script>
	export let scoreId, name;

	import * as Y from 'yjs';
	import { WebrtcProvider } from 'y-webrtc';
	import DoUsername from 'do_username';
	import Toast from '$c/Toast.svelte';
	import { onMount } from 'svelte';

	let users = [];
	let toastInstance;
	let firstTime = true;

	const monitorAwareness = () => {
		// A Yjs document holds the shared data
		const ydoc = new Y.Doc();

		const provider = new WebrtcProvider(`${scoreId}`, ydoc);

		// All network providers implement the awareness protocol. You can use it to propagate information about yourself.
		const awareness = provider.awareness;

		// Set a randomly generated username - this is nice for testing
		name = name || DoUsername.generate(15);
		awareness.setLocalStateField('user', { name });

		// Render a list of usernames next to the editor whenever new information is available from the awareness instance
		awareness.on('change', () => {
			if (firstTime) {
				users = Array.from(awareness.getStates().values()).map((userObj) => {
					return userObj?.user?.name;
				});
				firstTime = false;
			}
			const newUsers = Array.from(awareness.getStates().values()).map(
				(userObj) => {
					return userObj.user.name;
				}
			);

			if (users.length > newUsers.length) {
				userRemoved(users, newUsers);
			} else if (users.length < newUsers.length) {
				userAdded(newUsers);
			}
			users = newUsers;
		});

		function userRemoved(users, newUsers) {
			const removedUser = users.filter((user) => !newUsers.includes(user));
			toastInstance.trigger(`${removedUser} has left`);
		}
		function userAdded(newUsers) {
			const newUser = newUsers.at(-1);
			toastInstance.trigger(`${newUser} has joined`);
		}
	};

	//ydoc requires window so monitorAwareness requires onMount
	onMount(() => {
		monitorAwareness();
	});
</script>

<Toast bind:this={toastInstance} />
