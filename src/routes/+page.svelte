<script lang="ts">
	import WineCard from '$lib/components/WineCard.svelte';
	import Header from '$lib/components/Header.svelte';
	import { slide } from 'svelte/transition';

	let { data } = $props();
	let showSoldOut = $state(false);
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

		{#if data.soldOutWines.length > 0}
			<div class="mt-12 text-center">
				<button
					type="button"
					onclick={() => showSoldOut = !showSoldOut}
					class="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
					</svg>
					{showSoldOut ? 'Hide' : 'Show'} Sold Out Wines ({data.soldOutWines.length})
					<svg class="w-4 h-4 transition-transform {showSoldOut ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
					</svg>
				</button>
			</div>

			{#if showSoldOut}
				<div transition:slide={{ duration: 300 }} class="mt-8">
					<div class="border-t border-gray-300 pt-8">
						<h2 class="text-2xl font-bold text-gray-700 mb-6">Sold Out Wines</h2>
						<p class="text-gray-500 mb-6">These wines are currently unavailable. Check back later for restocks.</p>
						<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 opacity-75">
							{#each data.soldOutWines as wine}
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
					</div>
				</div>
			{/if}
		{/if}
	</main>
</div>
