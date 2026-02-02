<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from '$lib/stores/toast';

	let { data } = $props();
	let updatingId = $state<number | null>(null);

	const statusConfig = {
		pending: { label: 'Pending', class: 'bg-yellow-100 text-yellow-800' },
		ready: { label: 'Ready', class: 'bg-blue-100 text-blue-800' },
		completed: { label: 'Completed', class: 'bg-green-100 text-green-800' },
		cancelled: { label: 'Cancelled', class: 'bg-gray-100 text-gray-600' }
	} as const;

	const statusOptions = ['pending', 'ready', 'completed', 'cancelled'] as const;

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

	let filterStatus = $state<string>('all');
	const filteredReservations = $derived(
		filterStatus === 'all'
			? data.reservations
			: data.reservations.filter(r => r.status === filterStatus)
	);
</script>

<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
	<h1 class="text-3xl font-bold text-gray-900">Reservations</h1>
	<div class="flex items-center gap-2">
		<label for="filter" class="text-sm text-gray-600">Filter:</label>
		<select
			id="filter"
			bind:value={filterStatus}
			class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
		>
			<option value="all">All</option>
			<option value="pending">Pending</option>
			<option value="ready">Ready</option>
			<option value="completed">Completed</option>
			<option value="cancelled">Cancelled</option>
		</select>
	</div>
</div>

{#if data.reservations.length === 0}
	<div class="bg-white rounded-xl shadow p-8 text-center">
		<p class="text-gray-600">No reservations yet</p>
	</div>
{:else if filteredReservations.length === 0}
	<div class="bg-white rounded-xl shadow p-8 text-center">
		<p class="text-gray-600">No {filterStatus} reservations</p>
	</div>
{:else}
	<!-- Mobile card layout -->
	<div class="md:hidden space-y-4">
		{#each filteredReservations as reservation}
			<div class="bg-white rounded-xl shadow p-4">
				<div class="flex items-start justify-between mb-3">
					<div>
						<p class="font-semibold text-gray-900">{reservation.user.name}</p>
						<p class="text-sm text-gray-500">{reservation.user.email}</p>
					</div>
					<span class="px-2 py-1 rounded-full text-xs font-medium {statusConfig[reservation.status].class}">
						{statusConfig[reservation.status].label}
					</span>
				</div>
				<div class="mb-3">
					<a href="/admin/wines/{reservation.wine.id}" class="text-gold-600 hover:text-gold-700 font-medium">
						{reservation.wine.name}
					</a>
					<div class="flex items-center gap-3 mt-1 text-sm text-gray-600">
						<span>{reservation.quantity} × ${reservation.wine.price.toFixed(2)}</span>
						<span class="font-semibold text-gray-900">${(reservation.wine.price * reservation.quantity).toFixed(2)}</span>
					</div>
					<p class="text-xs text-gray-500 mt-1">{formatDate(reservation.createdAt)}</p>
				</div>
				<form
					method="POST"
					action="?/updateStatus"
					use:enhance={() => {
						updatingId = reservation.id;
						return async ({ result, update }) => {
							if (result.type === 'success') {
								toast.success('Status updated');
							} else if (result.type === 'failure') {
								toast.error('Failed to update status');
							}
							await update();
							updatingId = null;
						};
					}}
					class="flex items-center gap-2 pt-3 border-t border-gray-100"
				>
					<input type="hidden" name="reservationId" value={reservation.id} />
					<select
						name="status"
						disabled={updatingId === reservation.id}
						class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none disabled:opacity-50"
					>
						{#each statusOptions as status}
							<option value={status} selected={reservation.status === status}>
								{statusConfig[status].label}
							</option>
						{/each}
					</select>
					<button
						type="submit"
						disabled={updatingId === reservation.id}
						class="px-4 py-2 text-sm bg-gold-600 text-white rounded-lg hover:bg-gold-700 transition disabled:opacity-50"
					>
						{updatingId === reservation.id ? '...' : 'Update'}
					</button>
				</form>
			</div>
		{/each}
	</div>

	<!-- Desktop table layout -->
	<div class="hidden md:block bg-white rounded-xl shadow overflow-hidden">
		<table class="w-full">
			<thead class="bg-gray-50 border-b">
				<tr>
					<th class="text-left px-6 py-3 text-sm font-semibold text-gray-900">Customer</th>
					<th class="text-left px-6 py-3 text-sm font-semibold text-gray-900">Wine</th>
					<th class="text-left px-6 py-3 text-sm font-semibold text-gray-900">Qty</th>
					<th class="text-left px-6 py-3 text-sm font-semibold text-gray-900">Total</th>
					<th class="text-left px-6 py-3 text-sm font-semibold text-gray-900">Date</th>
					<th class="text-left px-6 py-3 text-sm font-semibold text-gray-900">Status</th>
					<th class="text-right px-6 py-3 text-sm font-semibold text-gray-900">Actions</th>
				</tr>
			</thead>
			<tbody class="divide-y">
				{#each filteredReservations as reservation}
					<tr class="hover:bg-gray-50">
						<td class="px-6 py-4">
							<p class="font-medium text-gray-900">{reservation.user.name}</p>
							<p class="text-sm text-gray-500">{reservation.user.email}</p>
						</td>
						<td class="px-6 py-4">
							<a href="/admin/wines/{reservation.wine.id}" class="text-gold-600 hover:text-gold-700 font-medium">
								{reservation.wine.name}
							</a>
						</td>
						<td class="px-6 py-4 text-gray-900">{reservation.quantity}</td>
						<td class="px-6 py-4 font-medium text-gray-900">
							${(reservation.wine.price * reservation.quantity).toFixed(2)}
						</td>
						<td class="px-6 py-4 text-sm text-gray-600">
							{formatDate(reservation.createdAt)}
						</td>
						<td class="px-6 py-4">
							<span class="px-3 py-1 rounded-full text-sm font-medium {statusConfig[reservation.status].class}">
								{statusConfig[reservation.status].label}
							</span>
						</td>
						<td class="px-6 py-4">
							<form
								method="POST"
								action="?/updateStatus"
								use:enhance={() => {
									updatingId = reservation.id;
									return async ({ result, update }) => {
										if (result.type === 'success') {
											toast.success('Status updated');
										} else if (result.type === 'failure') {
											toast.error('Failed to update status');
										}
										await update();
										updatingId = null;
									};
								}}
								class="flex items-center justify-end gap-2"
							>
								<input type="hidden" name="reservationId" value={reservation.id} />
								<select
									name="status"
									disabled={updatingId === reservation.id}
									class="px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none disabled:opacity-50"
								>
									{#each statusOptions as status}
										<option value={status} selected={reservation.status === status}>
											{statusConfig[status].label}
										</option>
									{/each}
								</select>
								<button
									type="submit"
									disabled={updatingId === reservation.id}
									class="px-3 py-1 text-sm bg-gold-600 text-white rounded-lg hover:bg-gold-700 transition disabled:opacity-50"
								>
									{updatingId === reservation.id ? '...' : 'Update'}
								</button>
							</form>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
