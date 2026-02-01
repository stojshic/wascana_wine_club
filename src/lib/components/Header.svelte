<script lang="ts">
  import { page } from '$app/stores';
	import { enhance } from '$app/forms';

	interface Props {
		user: { name: string; role: string } | null;
	}

	let { user }: Props = $props();

	const navItems = [
		{ href: '/admin', label: 'ADMIN PANEL', icon: 'admin', auth: 'admin' },
		{ href: '/dashboard', label: 'RESERVATIONS', icon: 'wine', auth: 'user' },
		{ href: '/', label: 'WINES', icon: 'home', auth: 'any' },
		{ href: '/logout', label: 'LOGOUT', icon: 'users', auth: 'user', type: 'form' }
	];

	// Optional helper for active link styling
	function isActive(href: string) {
		return href === $page.url.pathname;
	}
</script>

<nav class="fixed top-0 left-0 w-full bg-white shadow-lg z-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between h-26 items-center">
			<!-- Logo left -->
			<a href="/" class="flex items-center gap-2">
				<img src="/logo.webp" alt="Wascana Wine Club" class="h-24 w-auto" />
			</a>

			<!-- Nav right -->
			<div class="flex items-center gap-2">
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
						class="px-4 py-2 rounded-lg text-gray-700 hover:bg-[#c4a142] transition"
					>
						Login
					</a>
					<a
						href="/register"
						class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
					>
						Register
					</a>
				{/if}
			</div>
		</div>
	</div>
</nav>

