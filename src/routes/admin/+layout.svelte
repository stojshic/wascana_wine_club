<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';

	let { data, children } = $props();

	const navItems = [
		{ href: '/admin', label: 'DASHBOARD', icon: 'home' },
		{ href: '/admin/wines', label: 'WINES', icon: 'wine' },
		{ href: '/admin/reservations', label: 'RESERVATIONS', icon: 'list' },
		{ href: '/wines', label: 'VIEW SITE', icon: 'users' },
		{ href: '/logout', label: 'LOGOUT', icon: 'users' }
	];

	function isActive(href: string) {
		if (href === '/admin') {
			return $page.url.pathname === '/admin';
		}
		return $page.url.pathname.startsWith(href);
	}
</script>

<div class="min-h-screen bg-gray-100">
	<nav class="fixed top-0 left-0 w-full bg-gray-900 text-white shadow-lg z-50">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between h-26 items-center">

          <!-- Logo on the left -->
          <a href="/" class="flex items-center gap-2">
            <img src="/logo.webp" alt="Wascana Wine Club" class="h-24" />
            <span class="text-xl font-bold text-white">
              Admin Panel
            </span>
          </a>

        <!-- Nav on the right -->
        <div class="hidden md:flex items-center gap-1">
          {#each navItems as item}
            {#if item.label === 'Logout'}
              <form method="POST" action="/logout" use:enhance>
                <button
                  type="submit"
                  class="px-4 py-2 rounded-lg transition hover:bg-[#c4a142] flex items-center gap-1"
                >
                  {item.label}
                </button>
              </form>
            {:else}
              <a
                href={item.href}
                class="px-4 py-2 rounded-lg transition {isActive(item.href) ? 'bg-[#c4a142]' : 'hover:bg-[#c4a142]'} flex items-center gap-1"
              >
                {item.label}
              </a>
            {/if}
          {/each}
        </div>
			</div>
		</div>
		<!-- Mobile nav -->
		<div class="md:hidden border-t border-gold-100 px-4 py-2 flex gap-2">
			{#each navItems as item}
				<a
					href={item.href}
					class="flex-1 text-center px-3 py-2 rounded-lg text-sm transition {isActive(item.href) ? 'bg-gold-200' : 'hover:bg-gold-800'}"
				>
					{item.label}
				</a>
			{/each}
		</div>
	</nav>

	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-38">
		{@render children()}
	</main>
</div>
