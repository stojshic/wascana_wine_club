<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';

	let { data, children } = $props();

	const navItems = [
		{ href: '/admin', label: 'Dashboard', icon: 'home' },
		{ href: '/admin/wines', label: 'Wines', icon: 'wine' },
		{ href: '/admin/reservations', label: 'Reservations', icon: 'list' },
		{ href: '/admin/users', label: 'Users', icon: 'users' }
	];

	function isActive(href: string) {
		if (href === '/admin') {
			return $page.url.pathname === '/admin';
		}
		return $page.url.pathname.startsWith(href);
	}
</script>

<div class="min-h-screen bg-gray-100">
	<nav class="bg-purple-900 text-white shadow-lg">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between h-16 items-center">
				<div class="flex items-center gap-8">
					<a href="/admin" class="text-xl font-bold">Wine Club Admin</a>
					<div class="hidden md:flex items-center gap-1">
						{#each navItems as item}
							<a
								href={item.href}
								class="px-4 py-2 rounded-lg transition {isActive(item.href) ? 'bg-purple-800' : 'hover:bg-purple-800'}"
							>
								{item.label}
							</a>
						{/each}
					</div>
				</div>
				<div class="flex items-center gap-4">
					<a href="/" class="text-purple-200 hover:text-white transition text-sm">View Site</a>
					<span class="text-purple-200 hidden sm:inline">{data.user.name}</span>
					<form method="POST" action="/logout" use:enhance>
						<button type="submit" class="text-purple-200 hover:text-white transition">
							Logout
						</button>
					</form>
				</div>
			</div>
		</div>
		<!-- Mobile nav -->
		<div class="md:hidden border-t border-purple-800 px-4 py-2 flex gap-2">
			{#each navItems as item}
				<a
					href={item.href}
					class="flex-1 text-center px-3 py-2 rounded-lg text-sm transition {isActive(item.href) ? 'bg-purple-800' : 'hover:bg-purple-800'}"
				>
					{item.label}
				</a>
			{/each}
		</div>
	</nav>

	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		{@render children()}
	</main>
</div>
