<script>
	import { page } from '$app/stores';
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Collaboration from '@tiptap/extension-collaboration';
	import { HocuspocusProvider } from '@hocuspocus/provider';
	import { WebrtcProvider } from 'y-webrtc';
	import * as Y from 'yjs';
	let element;
	let editor, ydoc;

	let { params } = $page;
	console.log($page);

	onMount(() => {
		// // Set up the Hocuspocus WebSocket provider
		// const provider = new HocuspocusProvider({
		// 	url: 'wss://socketsbay.com/wss/v2/2/demo/',
		// 	name: 'example-document'
		// });
		ydoc = new Y.Doc();

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const provider = new WebrtcProvider(`${params.world}`, ydoc);
		console.log(provider);
		//`${Math.random}`
		editor = new Editor({
			element: element,
			extensions: [
				StarterKit,
				Collaboration.configure({
					document: ydoc
				})
			],
			content: '<p>Hello World! 🌍️ </p>',
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			}
		});
	});
	//$: console.log(editor);
	onDestroy(() => {
		if (editor) {
			editor.destroy();
			ydoc.destroy();
		}
	});
</script>

{#if editor}
	<button
		on:click={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
		class:active={editor.isActive('heading', { level: 1 })}
	>
		H1
	</button>
	<button
		on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
		class:active={editor.isActive('heading', { level: 2 })}
	>
		H2
	</button>
	<button
		on:click={() => editor.chain().focus().setParagraph().run()}
		class:active={editor.isActive('paragraph')}
	>
		P
	</button>
{/if}

<div bind:this={element} />

<style>
	button.active {
		background: black;
		color: white;
	}
</style>
