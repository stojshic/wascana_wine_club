<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from '$lib/stores/toast';
	import Header from '$lib/components/Header.svelte';

	let { data } = $props();
	let cancellingId = $state<number | null>(null);

	const statusConfig = {
		pending: { label: 'Pending Pickup', class: 'bg-yellow-100 text-yellow-800' },
		ready: { label: 'Ready for Pickup', class: 'bg-blue-100 text-blue-800' },
		completed: { label: 'Completed', class: 'bg-green-100 text-green-800' },
		cancelled: { label: 'Cancelled', class: 'bg-gray-100 text-gray-600' }
	} as const;

	function formatDate(date: Date | null) {
		if (!date) return '';
		return new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		}).format(date);
	}

	const activeReservations = $derived(
		data.reservations.filter(r => r.status !== 'cancelled' && r.status !== 'completed')
	);
	const pastReservations = $derived(
		data.reservations.filter(r => r.status === 'cancelled' || r.status === 'completed')
	);
</script>

<div class="min-h-screen bg-gray-100">
	<Header user={data.user} />

	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<div class="flex items-center justify-between mb-8">
			<h1 class="text-3xl font-bold text-gray-900">My Reservations</h1>
			<a
				href="/"
				class="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
			>
				Browse Wines
			</a>
		</div>

		{#if data.reservations.length === 0}
			<div class="bg-white rounded-xl shadow p-8 text-center">
				<div class="text-gray-400 mb-4">
					<svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
					</svg>
				</div>
				<h2 class="text-xl font-semibold text-gray-900 mb-2">No reservations yet</h2>
				<p class="text-gray-600 mb-6">Browse our wine collection and make your first reservation!</p>
				<a
					href="/"
					class="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
				>
					Browse Wines
				</a>
			</div>
		{:else}
			{#if activeReservations.length > 0}
				<div class="mb-8">
					<h2 class="text-xl font-semibold text-gray-900 mb-4">Active Reservations</h2>
					<div class="space-y-4">
						{#each activeReservations as reservation}
							<div class="bg-white rounded-xl shadow p-4 sm:p-6">
								<div class="flex flex-col sm:flex-row gap-4">
									<a href="/wines/{reservation.wine.id}" class="shrink-0">
										<div class="w-full sm:w-24 h-32 sm:h-24 bg-gray-100 rounded-lg overflow-hidden">
											{#if reservation.wine.imageUrl}
												<img
													src={reservation.wine.imageUrl}
													alt={reservation.wine.name}
													class="w-full h-full object-cover"
												/>
											{:else}
												<div class="w-full h-full flex items-center justify-center text-gray-400">
													<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
													</svg>
												</div>
											{/if}
										</div>
									</a>
									<div class="flex-1 min-w-0">
										<div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
											<div>
												<a href="/wines/{reservation.wine.id}" class="font-semibold text-gray-900 hover:text-purple-600 transition">
													{reservation.wine.name}
												</a>
												<p class="text-sm text-gray-600">
													{reservation.quantity} bottle{reservation.quantity > 1 ? 's' : ''} × ${reservation.wine.price.toFixed(2)}
												</p>
												<p class="text-sm text-gray-500 mt-1">
													Reserved {formatDate(reservation.createdAt)}
												</p>
											</div>
											<div class="flex items-center gap-3">
												<span class="px-3 py-1 rounded-full text-sm font-medium {statusConfig[reservation.status].class}">
													{statusConfig[reservation.status].label}
												</span>
												<span class="font-semibold text-purple-600">
													${(reservation.wine.price * reservation.quantity).toFixed(2)}
												</span>
											</div>
										</div>
										{#if reservation.status === 'pending'}
											<div class="mt-4 pt-4 border-t">
												<form
													method="POST"
													action="?/cancel"
													use:enhance={() => {
														cancellingId = reservation.id;
														return async ({ result, update }) => {
															if (result.type === 'success') {
																toast.success('Reservation cancelled');
															} else if (result.type === 'failure') {
																toast.error('Failed to cancel reservation');
															}
															await update();
															cancellingId = null;
														};
													}}
												>
													<input type="hidden" name="reservationId" value={reservation.id} />
													<button
														type="submit"
														disabled={cancellingId === reservation.id}
														class="text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
													>
														{cancellingId === reservation.id ? 'Cancelling...' : 'Cancel Reservation'}
													</button>
												</form>
											</div>
										{/if}
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			{#if pastReservations.length > 0}
				<div>
					<h2 class="text-xl font-semibold text-gray-900 mb-4">Past Reservations</h2>
					<div class="space-y-4">
						{#each pastReservations as reservation}
							<div class="bg-white rounded-xl shadow p-4 sm:p-6 opacity-75">
								<div class="flex flex-col sm:flex-row gap-4">
									<div class="shrink-0">
										<div class="w-full sm:w-20 h-24 sm:h-20 bg-gray-100 rounded-lg overflow-hidden">
											{#if reservation.wine.imageUrl}
												<img
													src={reservation.wine.imageUrl}
													alt={reservation.wine.name}
													class="w-full h-full object-cover"
												/>
											{:else}
												<div class="w-full h-full flex items-center justify-center text-gray-400">
													<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
													</svg>
												</div>
											{/if}
										</div>
									</div>
									<div class="flex-1 min-w-0">
										<div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
											<div>
												<p class="font-medium text-gray-700">{reservation.wine.name}</p>
												<p class="text-sm text-gray-500">
													{reservation.quantity} bottle{reservation.quantity > 1 ? 's' : ''} • {formatDate(reservation.createdAt)}
												</p>
											</div>
											<span class="px-3 py-1 rounded-full text-sm font-medium {statusConfig[reservation.status].class}">
												{statusConfig[reservation.status].label}
											</span>
										</div>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		{/if}
	</main>
</div>
