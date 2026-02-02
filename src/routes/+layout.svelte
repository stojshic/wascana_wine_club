<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Toast from '$lib/components/Toast.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { page } from '$app/stores';

	let { children } = $props();

	// Auth pages that shouldn't show footer or header padding
	const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email', '/verify-email-sent', '/setup-account'];
	const isAuthPage = $derived(authRoutes.some(route => $page.url.pathname.startsWith(route)));
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen flex flex-col">
	<main class="{isAuthPage ? '' : 'pt-26'} flex-1">
		{@render children()}
	</main>
	{#if !isAuthPage}
		<Footer />
	{/if}
</div>
<Toast />
