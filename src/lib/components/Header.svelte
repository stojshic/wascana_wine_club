<script lang="ts">
	import { enhance } from '$app/forms';

	interface Props {
		user: { name: string; role: string } | null;
	}

	let { user }: Props = $props();
</script>

<nav class="bg-white shadow">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between h-16 items-center">
			<a href="/" class="text-xl font-bold text-purple-600">Wine Club</a>
			<div class="flex items-center gap-4">
				{#if user}
					{#if user.role === 'admin'}
						<a href="/admin" class="text-gray-700 hover:text-purple-600 transition">Management</a>
					{/if}
					<a href="/dashboard" class="text-gray-700 hover:text-purple-600 transition">Dashboard</a>
					<a href="/" class="text-gray-700 hover:text-purple-600 transition">Wines</a>
					<span class="text-gray-600 hidden sm:inline">Hello, {user.name}</span>
					<form method="POST" action="/logout" use:enhance>
						<button type="submit" class="text-gray-600 hover:text-red-600 transition">
							Logout
						</button>
					</form>
				{:else}
					<a href="/login" class="text-gray-700 hover:text-purple-600 transition">Login</a>
					<a href="/register" class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
						Register
					</a>
				{/if}
			</div>
		</div>
	</div>
</nav>
