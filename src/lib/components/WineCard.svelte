<script lang="ts">
	interface Props {
		id: number;
		name: string;
		description: string;
		price: number;
		imageUrl: string | null;
		stock: number;
	}

	let { id, name, description, price, imageUrl, stock }: Props = $props();

	const truncatedDescription = description.length > 100
		? description.slice(0, 100) + '...'
		: description;
</script>

<a
	href="/wines/{id}"
	class="block bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden group"
>
	<div class="aspect-[3/4] bg-gray-100 relative overflow-hidden">
		{#if imageUrl}
			<img
				src={imageUrl}
				alt={name}
				class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
			/>
		{:else}
			<div class="w-full h-full flex items-center justify-center text-gray-400">
				<svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
				</svg>
			</div>
		{/if}
		{#if stock === 0}
			<div class="absolute inset-0 bg-black/50 flex items-center justify-center">
				<span class="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">Out of Stock</span>
			</div>
		{:else if stock <= 5}
			<div class="absolute top-2 right-2">
				<span class="bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium">Only {stock} left</span>
			</div>
		{/if}
	</div>
	<div class="p-4">
		<h3 class="font-semibold text-gray-900 text-lg mb-1 group-hover:text-gold-600 transition">{name}</h3>
		<p class="text-gray-600 text-sm mb-3">{truncatedDescription}</p>
		<div class="flex items-center justify-between">
			<span class="text-xl font-bold text-gold-600">${price.toFixed(2)}</span>
			<span class="text-sm text-gold-600 group-hover:translate-x-1 transition">View →</span>
		</div>
	</div>
</a>
