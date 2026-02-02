<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { slide } from 'svelte/transition';

	let { data, children } = $props();
	let mobileMenuOpen = $state(false);

	const navItems = [
		{ href: '/admin', label: 'DASHBOARD' },
		{ href: '/admin/wines', label: 'WINES' },
		{ href: '/admin/reservations', label: 'RESERVATIONS' },
		{ href: '/admin/users', label: 'USERS' },
		{ href: '/wines', label: 'VIEW SITE' },
		{ href: '/logout', label: 'LOGOUT', type: 'form' }
	];

	function isActive(href: string) {
		if (href === '/admin') {
			return $page.url.pathname === '/admin';
		}
		return $page.url.pathname.startsWith(href);
	}

	function toggleMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMenu() {
		mobileMenuOpen = false;
	}
</script>

<div class="min-h-screen bg-gray-100">
	<nav class="fixed top-0 left-0 w-full bg-gray-900 text-white shadow-lg z-50">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between h-26 items-center">
				<!-- Hamburger button (mobile only) -->
				<button
					type="button"
					onclick={toggleMenu}
					class="md:hidden p-2 rounded-lg text-white hover:bg-gray-800 transition"
					aria-label="Toggle menu"
				>
					{#if mobileMenuOpen}
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					{:else}
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
						</svg>
					{/if}
				</button>

				<!-- Logo (centered on mobile) -->
				<a href="/admin" class="flex items-center gap-2 md:order-first absolute left-1/2 -translate-x-1/2 md:relative md:left-0 md:translate-x-0">
					<img src="/logo.webp" alt="Wascana Wine Club" class="h-24" />
					<span class="hidden sm:inline text-xl font-bold text-white">Admin</span>
				</a>

				<!-- Desktop nav -->
				<div class="hidden md:flex items-center gap-1">
					{#each navItems as item}
						{#if item.type === 'form'}
							<form method="POST" action="/logout" use:enhance>
								<button
									type="submit"
									class="px-4 py-2 rounded-lg transition hover:bg-gold-600 flex items-center gap-1"
								>
									{item.label}
								</button>
							</form>
						{:else}
							<a
								href={item.href}
								class="px-4 py-2 rounded-lg transition {isActive(item.href) ? 'bg-gold-600' : 'hover:bg-gold-600'} flex items-center gap-1"
							>
								{item.label}
							</a>
						{/if}
					{/each}
				</div>

				<!-- Spacer for mobile -->
				<div class="w-10 md:hidden"></div>
			</div>
		</div>

		<!-- Mobile menu dropdown -->
		{#if mobileMenuOpen}
			<div transition:slide={{ duration: 200 }} class="md:hidden bg-gray-800 border-t border-gray-700">
				<div class="px-4 py-3 space-y-1">
					{#each navItems as item}
						{#if item.type === 'form'}
							<form method="POST" action="/logout" use:enhance>
								<button
									type="submit"
									onclick={closeMenu}
									class="w-full text-left px-4 py-3 rounded-lg transition hover:bg-gray-700 text-white"
								>
									{item.label}
								</button>
							</form>
						{:else}
							<a
								href={item.href}
								onclick={closeMenu}
								class="block px-4 py-3 rounded-lg transition {isActive(item.href) ? 'bg-gold-600 text-white' : 'hover:bg-gray-700 text-white'}"
							>
								{item.label}
							</a>
						{/if}
					{/each}
				</div>
			</div>
		{/if}
	</nav>

	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-38">
		{@render children()}
	</main>
</div>
