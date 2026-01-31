<script lang="ts">
	import { toast, type Toast } from '$lib/stores/toast';
	import { fly } from 'svelte/transition';

	let toasts: Toast[] = $state([]);

	toast.subscribe((value) => {
		toasts = value;
	});

	const icons = {
		success: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />`,
		error: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />`,
		info: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />`
	};

	const colors = {
		success: 'bg-green-600',
		error: 'bg-red-600',
		info: 'bg-blue-600'
	};
</script>

{#if toasts.length > 0}
	<div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
		{#each toasts as t (t.id)}
			<div
				transition:fly={{ x: 100, duration: 200 }}
				class="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white {colors[t.type]}"
			>
				<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					{@html icons[t.type]}
				</svg>
				<p class="flex-1 text-sm font-medium">{t.message}</p>
				<button
					onclick={() => toast.remove(t.id)}
					class="shrink-0 hover:opacity-75 transition"
					aria-label="Dismiss"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
		{/each}
	</div>
{/if}
