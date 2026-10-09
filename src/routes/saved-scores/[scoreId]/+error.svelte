<script>
	import { page } from '$app/state';
</script>

<h1>{page.status}</h1>
<div>{page.error?.message}</div>
