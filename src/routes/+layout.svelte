<script>
	import '../app.css';
	import { user } from '$stores/user';
	import Nav from '$c/Nav.svelte';
	console.log($user);
</script>

<div class="p-20">
	<Nav />

	<div class="mt-8 w-full  h-screen flex flex-col items-center">
		<div class="max-w-4xl flex flex-col items-center">
			<slot />
		</div>
	</div>
</div>
