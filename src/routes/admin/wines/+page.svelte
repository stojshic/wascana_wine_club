<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from '$lib/stores/toast';

	let { data } = $props();
	let deletingId = $state<number | null>(null);
</script>

<div class="flex items-center justify-between mb-8">
	<h1 class="text-3xl font-bold text-gray-900">Wines</h1>
	<a
		href="/admin/wines/new"
		class="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
	>
		Add Wine
	</a>
</div>

{#if data.wines.length === 0}
	<div class="bg-white rounded-xl shadow p-8 text-center">
		<p class="text-gray-600 mb-4">No wines in catalog yet</p>
		<a
			href="/admin/wines/new"
			class="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
		>
			Add Your First Wine
		</a>
	</div>
{:else}
	<div class="bg-white rounded-xl shadow overflow-hidden">
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="bg-gray-50 border-b">
					<tr>
						<th class="text-left px-6 py-3 text-sm font-semibold text-gray-900">Wine</th>
						<th class="text-left px-6 py-3 text-sm font-semibold text-gray-900">Price</th>
						<th class="text-left px-6 py-3 text-sm font-semibold text-gray-900">Stock</th>
						<th class="text-right px-6 py-3 text-sm font-semibold text-gray-900">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y">
					{#each data.wines as wine}
						<tr class="hover:bg-gray-50">
							<td class="px-6 py-4">
								<div class="flex items-center gap-3">
									<div class="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
										{#if wine.imageUrl}
											<img src={wine.imageUrl} alt={wine.name} class="w-full h-full object-cover" />
										{:else}
											<div class="w-full h-full flex items-center justify-center text-gray-400">
												<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
												</svg>
											</div>
										{/if}
									</div>
									<div>
										<p class="font-medium text-gray-900">{wine.name}</p>
										<p class="text-sm text-gray-500 truncate max-w-xs">{wine.description}</p>
									</div>
								</div>
							</td>
							<td class="px-6 py-4 font-medium text-gray-900">${wine.price.toFixed(2)}</td>
							<td class="px-6 py-4">
								{#if wine.stock === 0}
									<span class="text-red-600 font-medium">Out of stock</span>
								{:else if wine.stock <= 5}
									<span class="text-amber-600 font-medium">{wine.stock} left</span>
								{:else}
									<span class="text-green-600 font-medium">{wine.stock}</span>
								{/if}
							</td>
							<td class="px-6 py-4">
								<div class="flex items-center justify-end gap-2">
									<a
										href="/admin/wines/{wine.id}"
										class="text-purple-600 hover:text-purple-700 font-medium text-sm"
									>
										Edit
									</a>
									<form
										method="POST"
										action="?/delete"
										use:enhance={() => {
											if (!confirm('Are you sure you want to delete this wine?')) {
												return () => {};
											}
											deletingId = wine.id;
											return async ({ result, update }) => {
												if (result.type === 'success') {
													toast.success('Wine deleted');
												} else if (result.type === 'failure') {
													toast.error('Failed to delete wine');
												}
												await update();
												deletingId = null;
											};
										}}
									>
										<input type="hidden" name="wineId" value={wine.id} />
										<button
											type="submit"
											disabled={deletingId === wine.id}
											class="text-red-600 hover:text-red-700 font-medium text-sm disabled:opacity-50"
										>
											{deletingId === wine.id ? 'Deleting...' : 'Delete'}
										</button>
									</form>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{/if}
