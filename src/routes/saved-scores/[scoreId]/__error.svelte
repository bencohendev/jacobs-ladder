<script context="module">
	/** @type {import('@sveltejs/kit').Load} */
	export function load({ error, status }) {
		return {
			props: {
				title: `${status}`,
				message: error.message
			}
		};
	}
</script>

<script>
	export let title, message;
</script>

<h1>{title}</h1>
<div>{message}</div>
