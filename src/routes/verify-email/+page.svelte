<script lang="ts">
	let { data } = $props();
</script>

<div class="min-h-screen bg-gradient-to-br from-gold-900 via-gold-800 to-amber-900 flex items-center justify-center p-4">
	<div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
		{#if data.success}
			<div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
				<svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
				</svg>
			</div>

			<h1 class="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h1>
			<p class="text-gray-600 mb-6">
				Your email has been successfully verified. You can now make wine reservations.
			</p>

			<a href="/" class="block w-full bg-gold-600 text-white py-3 rounded-lg font-semibold hover:bg-gold-700 transition">
				Start Browsing Wines
			</a>
		{:else}
			<div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
				<svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</div>

			<h1 class="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
			<p class="text-gray-600 mb-6">
				{data.error}
			</p>

			<div class="space-y-3">
				<a href="/verify-email-sent" class="block w-full bg-gold-600 text-white py-3 rounded-lg font-semibold hover:bg-gold-700 transition">
					Request New Link
				</a>
				<a href="/" class="block w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition">
					Go to Homepage
				</a>
			</div>
		{/if}
	</div>
</div>
