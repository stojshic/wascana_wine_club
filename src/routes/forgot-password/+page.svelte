<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
	let loading = $state(false);
</script>

<div class="min-h-screen bg-gradient-to-br from-gold-900 via-gold-800 to-amber-900 flex items-center justify-center p-4">
	<div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
		{#if form?.success}
			<div class="text-center">
				<div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
					<svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
					</svg>
				</div>

				<h1 class="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
				<p class="text-gray-600 mb-6">
					If an account exists with that email, we've sent a password reset link.
				</p>

				<a href="/login" class="block w-full bg-gold-600 text-white py-3 rounded-lg font-semibold hover:bg-gold-700 transition">
					Back to Login
				</a>
			</div>
		{:else}
			<h1 class="text-3xl font-bold text-gray-900 text-center mb-2">Forgot Password</h1>
			<p class="text-gray-600 text-center mb-8">Enter your email to receive a reset link</p>

			{#if form?.error}
				<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
					{form.error}
				</div>
			{/if}

			<form
				method="POST"
				class="space-y-5"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						await update();
						loading = false;
					};
				}}
			>
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
					<input
						type="email"
						id="email"
						name="email"
						required
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition"
						placeholder="you@example.com"
					/>
				</div>

				<button
					type="submit"
					disabled={loading}
					class="w-full bg-gold-600 text-white py-3 rounded-lg font-semibold hover:bg-gold-700 transition disabled:opacity-50"
				>
					{loading ? 'Sending...' : 'Send Reset Link'}
				</button>
			</form>

			<p class="text-center text-gray-600 mt-6">
				Remember your password?
				<a href="/login" class="text-gold-600 font-semibold hover:underline">Login</a>
			</p>
		{/if}
	</div>
</div>
