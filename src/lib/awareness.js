import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import DoUsername from 'do_username';

const monitorAwareness = (roomId, name) => {
	// A Yjs document holds the shared data
	const ydoc = new Y.Doc();

	const provider = new WebrtcProvider(`${roomId}`, ydoc, {
		signaling: ['ws://localhost:5173']
	});

	// All network providers implement the awareness protocol. You can use it to propagate information about yourself.
	const awareness = provider.awareness;
	console.log('aware', awareness);
	const setUsername = () => {
		awareness.setLocalStateField('user', { name });
	};
	// Set a randomly generated username - this is nice for testing
	if (!name) {
		name = DoUsername.generate(15);
	}
	setUsername();
	// Render a list of usernames next to the editor whenever new information is available from the awareness instance
	awareness.on('change', () => {
		// Map each awareness state to a dom-string
		const strings = [];
		awareness.getStates().forEach((state) => {
			console.log(state);
			// if (state.user) {
			//   strings.push(`<div style="color:${state.user.color};">• ${state.user.name}</div>`)
			// }
		});
	});
};

export default monitorAwareness;
