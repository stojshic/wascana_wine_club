<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { toast } from '$lib/stores/toast';

	let { form } = $props();
	let loading = $state(false);

	// Check for password reset success
	const resetSuccess = $derived($page.url.searchParams.get('reset') === 'success');

	$effect(() => {
		if (form?.error) {
			toast.error(form.error);
		}
		if (resetSuccess) {
			toast.success('Password reset successfully. Please log in.');
		}
	});
</script>

<div class="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-red-900 flex items-center justify-center p-4">
	<div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
		<h1 class="text-3xl font-bold text-gray-900 text-center mb-2">Welcome Back</h1>
		<p class="text-gray-600 text-center mb-8">Sign in to your account</p>

		{#if resetSuccess}
			<div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
				Password reset successfully. Please log in with your new password.
			</div>
		{/if}

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
					value={form?.email ?? ''}
					required
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
					placeholder="you@example.com"
				/>
			</div>

			<div>
				<div class="flex items-center justify-between mb-1">
					<label for="password" class="block text-sm font-medium text-gray-700">Password</label>
					<a href="/forgot-password" class="text-sm text-purple-600 hover:underline">Forgot password?</a>
				</div>
				<input
					type="password"
					id="password"
					name="password"
					required
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
					placeholder="Your password"
				/>
			</div>

			<button
				type="submit"
				disabled={loading}
				class="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
			>
				{loading ? 'Signing in...' : 'Sign In'}
			</button>
		</form>

		<p class="text-center text-gray-600 mt-6">
			Don't have an account?
			<a href="/register" class="text-purple-600 font-semibold hover:underline">Register</a>
		</p>
	</div>
</div>
