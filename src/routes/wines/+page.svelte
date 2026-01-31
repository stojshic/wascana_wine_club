<script lang="ts">
	import WineCard from '$lib/components/WineCard.svelte';
	import Header from '$lib/components/Header.svelte';

	let { data } = $props();
</script>

<div class="min-h-screen bg-gray-100">
	<Header user={data.user} />

	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900">Our Wines</h1>
			<p class="text-gray-600 mt-2">Browse our selection and reserve your favorites</p>
		</div>

		{#if data.wines.length === 0}
			<div class="text-center py-16">
				<div class="text-gray-400 mb-4">
					<svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
					</svg>
				</div>
				<h2 class="text-xl font-semibold text-gray-900 mb-2">No wines available</h2>
				<p class="text-gray-600">Check back soon for our wine collection!</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{#each data.wines as wine}
					<WineCard
						id={wine.id}
						name={wine.name}
						description={wine.description}
						price={wine.price}
						imageUrl={wine.imageUrl}
						stock={wine.stock}
					/>
				{/each}
			</div>
		{/if}
	</main>
</div>
