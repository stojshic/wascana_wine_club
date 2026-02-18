<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { toast } from '$lib/stores/toast';
	import Header from '$lib/components/Header.svelte';

	let { data, form } = $props();
	let quantity = $state(1);
	let loading = $state(false);
	let showSuccess = $state(false);
	let successMessage = $state('');

	const maxQuantity = Math.min(data.wine.stock, data.wine.maxReserveQuantity ?? 10);

	function incrementQuantity() {
		if (quantity < maxQuantity) quantity++;
	}

	function decrementQuantity() {
		if (quantity > 1) quantity--;
	}
</script>

<div class="min-h-screen bg-gray-100">
	<Header user={data.user} />

	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<a href="/" class="inline-flex items-center text-gold-600 hover:text-gold-700 mb-6">
			<svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
			Back to wines
		</a>

		<div class="bg-white rounded-2xl shadow-lg overflow-hidden">
			<div class="md:flex">
				<div class="md:w-1/2">
					<div class="aspect-square bg-gray-100 relative">
						{#if data.wine.imageUrl}
							<img
								src={data.wine.imageUrl}
								alt={data.wine.name}
								class="w-full h-full object-cover"
							/>
						{:else}
							<div class="w-full h-full flex items-center justify-center text-gray-400">
								<svg class="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
							</div>
						{/if}
					</div>
				</div>

				<div class="md:w-1/2 p-6 md:p-8">
					<h1 class="text-3xl font-bold text-gray-900 mb-2">{data.wine.name}</h1>

					<div class="flex items-center gap-4 mb-6">
						<span class="text-3xl font-bold text-gold-600">${data.wine.price.toFixed(2)}</span>
						{#if data.wine.stock === 0}
							<span class="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">Out of Stock</span>
            <!--
						{:else if data.wine.stock <= 5}
							<span class="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">Only {data.wine.stock} left</span>
						{:else}
							<span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">In Stock ({data.wine.stock})</span>
            -->
						{:else}
							<span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">In Stock</span>
						{/if}
					</div>

					<div class="prose prose-gray mb-8">
						<p class="text-gray-600 leading-relaxed">{data.wine.description}</p>
					</div>

					{#if showSuccess}
						<div class="border-t pt-6">
							<div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
								<div class="flex items-center gap-3">
									<svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
									</svg>
									<div>
										<p class="font-semibold text-green-800">Reservation Confirmed!</p>
										<p class="text-green-700 text-sm">{successMessage}</p>
									</div>
								</div>
							</div>
							<div class="flex gap-3">
								<a href="/dashboard" class="bg-gold-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gold-700 transition">
									View My Reservations
								</a>
								<button
									onclick={() => { showSuccess = false; quantity = 1; }}
									class="border border-gray-300 px-6 py-2 rounded-lg font-semibold hover:bg-gray-50 transition"
								>
									Reserve More
								</button>
							</div>
						</div>
					{:else if data.user}
						{#if data.wine.stock > 0}
							<div class="border-t pt-6">
								<p class="text-sm text-gray-500 mb-4">Reserve this wine for pickup at our club</p>

								{#if form?.error}
									<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
										{form.error}
									</div>
								{/if}

								<form
									method="POST"
									action="?/reserve"
									use:enhance={() => {
										loading = true;
										return async ({ result, update }) => {
											loading = false;
											if (result.type === 'success') {
												const resultData = result.data as { success?: boolean; quantity?: number; wineName?: string };
												if (resultData?.success) {
													showSuccess = true;
													const qty = resultData.quantity ?? 1;
													successMessage = `${qty} bottle${qty > 1 ? 's' : ''} of ${resultData.wineName} reserved`;
													toast.success('Reservation confirmed!');
													await invalidateAll();
													return;
												}
											}
											if (result.type === 'failure') {
												const failData = result.data as { error?: string };
												if (failData?.error) {
													toast.error(failData.error);
												}
											}
											await update();
										};
									}}
									class="space-y-4"
								>
									<div>
										<label for="quantity" class="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
										<div class="flex items-center gap-3">
											<button
												type="button"
												onclick={decrementQuantity}
												disabled={quantity <= 1}
												aria-label="Decrease quantity"
												class="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
											>
												<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
												</svg>
											</button>
											<input
												type="number"
												id="quantity"
												name="quantity"
												bind:value={quantity}
												min="1"
												max={maxQuantity}
												class="w-20 text-center px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
											/>
											<button
												type="button"
												onclick={incrementQuantity}
												disabled={quantity >= maxQuantity}
												aria-label="Increase quantity"
												class="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
											>
												<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
												</svg>
											</button>
											<span class="text-sm text-gray-500">Max {maxQuantity}</span>
										</div>
									</div>

									<div class="flex items-center justify-between pt-2">
										<span class="text-lg text-gray-600">
											Total: <span class="font-bold text-gold-600">${(data.wine.price * quantity).toFixed(2)}</span>
										</span>
										<button
											type="submit"
											disabled={loading}
											class="bg-gold-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gold-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
										>
											{loading ? 'Reserving...' : 'Reserve Now'}
										</button>
									</div>
								</form>
							</div>
						{:else}
							<div class="border-t pt-6">
								<p class="text-gray-500">This wine is currently out of stock. Check back later!</p>
							</div>
						{/if}
					{:else}
						<div class="border-t pt-6">
							<p class="text-gray-600 mb-4">Please log in to reserve this wine</p>
							<a
								href="/login"
								class="inline-block bg-gold-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gold-700 transition"
							>
								Login to Reserve
							</a>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</main>
</div>
