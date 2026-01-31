<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let loading = $state(false);
</script>

<div class="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-red-900 flex items-center justify-center p-4">
	<div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
		{#if !data.valid}
			<div class="text-center">
				<div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
					<svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</div>

				<h1 class="text-2xl font-bold text-gray-900 mb-2">Invalid Link</h1>
				<p class="text-gray-600 mb-6">{data.error}</p>

				<a href="/forgot-password" class="block w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
					Request New Link
				</a>
			</div>
		{:else}
			<h1 class="text-3xl font-bold text-gray-900 text-center mb-2">Reset Password</h1>
			<p class="text-gray-600 text-center mb-8">Enter your new password</p>

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
				<input type="hidden" name="token" value={data.token} />

				<div>
					<label for="password" class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
					<input
						type="password"
						id="password"
						name="password"
						required
						minlength="6"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
						placeholder="At least 6 characters"
					/>
				</div>

				<div>
					<label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
					<input
						type="password"
						id="confirmPassword"
						name="confirmPassword"
						required
						minlength="6"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
						placeholder="Repeat your password"
					/>
				</div>

				<button
					type="submit"
					disabled={loading}
					class="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
				>
					{loading ? 'Resetting...' : 'Reset Password'}
				</button>
			</form>
		{/if}
	</div>
</div>
