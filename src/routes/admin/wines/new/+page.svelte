<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
	let loading = $state(false);
</script>

<div class="max-w-2xl">
	<div class="mb-8">
		<a href="/admin/wines" class="text-gold-600 hover:text-gold-700 text-sm">← Back to wines</a>
		<h1 class="text-3xl font-bold text-gray-900 mt-2">Add New Wine</h1>
	</div>

	<div class="bg-white rounded-xl shadow p-6">
		{#if form?.error}
			<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
				{form.error}
			</div>
		{/if}

		<form
			method="POST"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					await update();
					loading = false;
				};
			}}
			class="space-y-6"
		>
			<div>
				<label for="name" class="block text-sm font-medium text-gray-700 mb-1">Wine Name</label>
				<input
					type="text"
					id="name"
					name="name"
					value={form?.name ?? ''}
					required
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
					placeholder="e.g., Château Margaux 2018"
				/>
			</div>

			<div>
				<label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
				<textarea
					id="description"
					name="description"
					rows="4"
					required
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none resize-none"
					placeholder="Describe the wine's taste, origin, pairing suggestions..."
				>{form?.description ?? ''}</textarea>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="price" class="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
					<input
						type="number"
						id="price"
						name="price"
						value={form?.price ?? ''}
						required
						min="0"
						step="0.01"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
						placeholder="0.00"
					/>
				</div>

				<div>
					<label for="stock" class="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
					<input
						type="number"
						id="stock"
						name="stock"
						value={form?.stock ?? ''}
						required
						min="0"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
						placeholder="0"
					/>
				</div>
			</div>

			<div>
				<label for="maxReserveQuantity" class="block text-sm font-medium text-gray-700 mb-1">Max Reserve Quantity</label>
				<input
					type="number"
					id="maxReserveQuantity"
					name="maxReserveQuantity"
					value={form?.maxReserveQuantity ?? 10}
					required
					min="1"
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
					placeholder="10"
				/>
				<p class="text-sm text-gray-500 mt-1">Maximum number of bottles a customer can reserve at once</p>
			</div>

			<div>
				<label for="imageUrl" class="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</label>
				<input
					type="url"
					id="imageUrl"
					name="imageUrl"
					value={form?.imageUrl ?? ''}
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
					placeholder="https://example.com/wine-image.jpg"
				/>
				<p class="text-sm text-gray-500 mt-1">Enter a URL to an image of the wine</p>
			</div>

			<div class="flex gap-3 pt-4">
				<button
					type="submit"
					disabled={loading}
					class="bg-gold-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gold-700 transition disabled:opacity-50"
				>
					{loading ? 'Adding...' : 'Add Wine'}
				</button>
				<a
					href="/admin/wines"
					class="px-6 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition"
				>
					Cancel
				</a>
			</div>
		</form>
	</div>
</div>
