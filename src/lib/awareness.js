import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import DoUsername from 'do_username';

const monitorAwareness = (scoreId, name) => {
	// A Yjs document holds the shared data
	const ydoc = new Y.Doc();

	const provider = new WebrtcProvider(`${scoreId}`, ydoc);

	// All network providers implement the awareness protocol. You can use it to propagate information about yourself.
	const awareness = provider.awareness;
	console.log('aware', awareness);
	const setUsername = () => {
		console.log('set username', name);
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
		console.log(Array.from(awareness.getStates().values()));
	});
};

export default monitorAwareness;
