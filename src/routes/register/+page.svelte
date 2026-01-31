<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from '$lib/stores/toast';

	let { form } = $props();
	let loading = $state(false);

	$effect(() => {
		if (form?.error) {
			toast.error(form.error);
		}
	});
</script>

<div class="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-red-900 flex items-center justify-center p-4">
	<div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
		<h1 class="text-3xl font-bold text-gray-900 text-center mb-2">Create Account</h1>
		<p class="text-gray-600 text-center mb-8">Join our wine club</p>

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
				<label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
				<input
					type="text"
					id="name"
					name="name"
					value={form?.name ?? ''}
					required
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
					placeholder="Your name"
				/>
			</div>

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
				<label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
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
				{loading ? 'Creating account...' : 'Create Account'}
			</button>
		</form>

		<p class="text-center text-gray-600 mt-6">
			Already have an account?
			<a href="/login" class="text-purple-600 font-semibold hover:underline">Login</a>
		</p>
	</div>
</div>
