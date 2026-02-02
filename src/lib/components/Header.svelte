<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { slide } from 'svelte/transition';

	interface Props {
		user: { name: string; role: string } | null;
	}

	let { user }: Props = $props();
	let mobileMenuOpen = $state(false);

	const navItems = [
		{ href: '/admin', label: 'ADMIN PANEL', icon: 'admin', auth: 'admin' },
		{ href: '/dashboard', label: 'RESERVATIONS', icon: 'wine', auth: 'user' },
		{ href: '/', label: 'WINES', icon: 'home', auth: 'any' },
		{ href: '/logout', label: 'LOGOUT', icon: 'users', auth: 'user', type: 'form' }
	];

	function isActive(href: string) {
		return href === $page.url.pathname;
	}

	function toggleMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMenu() {
		mobileMenuOpen = false;
	}
</script>

<nav class="fixed top-0 left-0 w-full bg-white shadow-lg z-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between h-26 items-center">
			<!-- Hamburger button (mobile only) -->
			<button
				type="button"
				onclick={toggleMenu}
				class="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
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

			<!-- Logo (centered on mobile, left on desktop) -->
			<a href="/" class="flex items-center gap-2 md:order-first absolute left-1/2 -translate-x-1/2 md:relative md:left-0 md:translate-x-0">
				<img src="/logo.webp" alt="Wascana Wine Club" class="h-24 w-auto" />
			</a>

			<!-- Desktop nav (hidden on mobile) -->
			<div class="hidden md:flex items-center gap-2">
				{#if user}
					{#each navItems as item}
						{#if item.auth === 'any' || (item.auth === 'user' && user) || (item.auth === 'admin' && user.role === 'admin')}
							{#if item.type === 'form'}
								<form method="POST" action={item.href} use:enhance>
									<button
										type="submit"
										class="px-4 py-2 rounded-lg transition hover:bg-[#c4a142] flex items-center gap-1 text-gray-700"
									>
										{item.label}
									</button>
								</form>
							{:else}
								<a
									href={item.href}
									class="px-4 py-2 rounded-lg transition {isActive(item.href) ? 'bg-[#c4a142]' : 'hover:bg-[#c4a142]'} flex items-center gap-1 text-gray-700"
								>
									{item.label}
								</a>
							{/if}
						{/if}
					{/each}
				{:else}
					<a
						href="/login"
						class="bg-gold-600 text-white px-4 py-2 rounded-lg hover:bg-gold-700 transition"
					>
						Login
					</a>
				{/if}
			</div>

			<!-- Spacer for mobile (to balance hamburger) -->
			<div class="w-10 md:hidden"></div>
		</div>
	</div>

	<!-- Mobile menu dropdown -->
	{#if mobileMenuOpen}
		<div transition:slide={{ duration: 200 }} class="md:hidden bg-white border-t border-gray-200 shadow-lg">
			<div class="px-4 py-3 space-y-1">
				{#if user}
					{#each navItems as item}
						{#if item.auth === 'any' || (item.auth === 'user' && user) || (item.auth === 'admin' && user.role === 'admin')}
							{#if item.type === 'form'}
								<form method="POST" action={item.href} use:enhance>
									<button
										type="submit"
										onclick={closeMenu}
										class="w-full text-left px-4 py-3 rounded-lg transition hover:bg-gold-100 text-gray-700"
									>
										{item.label}
									</button>
								</form>
							{:else}
								<a
									href={item.href}
									onclick={closeMenu}
									class="block px-4 py-3 rounded-lg transition {isActive(item.href) ? 'bg-gold-100 text-gold-800' : 'hover:bg-gold-100'} text-gray-700"
								>
									{item.label}
								</a>
							{/if}
						{/if}
					{/each}
				{:else}
					<a
						href="/login"
						onclick={closeMenu}
						class="block px-4 py-3 rounded-lg bg-gold-600 text-white hover:bg-gold-700 transition text-center"
					>
						Login
					</a>
				{/if}
			</div>
		</div>
	{/if}
</nav>

