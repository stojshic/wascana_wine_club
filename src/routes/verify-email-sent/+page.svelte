<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from '$lib/stores/toast';

	let { data } = $props();
	let resending = $state(false);
</script>

<div class="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-red-900 flex items-center justify-center p-4">
	<div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
		<div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
			<svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
			</svg>
		</div>

		<h1 class="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
		<p class="text-gray-600 mb-6">
			We've sent a verification link to <strong>{data.user?.email}</strong>.
			Please check your inbox and click the link to verify your account.
		</p>

		<div class="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-left">
			<p class="text-amber-800 text-sm">
				<strong>Note:</strong> You can browse wines, but you won't be able to make reservations until your email is verified.
			</p>
		</div>

		<div class="space-y-4">
			<a href="/" class="block w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
				Browse Wines
			</a>

			<form
				method="POST"
				action="?/resend"
				use:enhance={() => {
					resending = true;
					return async ({ result, update }) => {
						if (result.type === 'success') {
							toast.success('Verification email sent!');
						} else if (result.type === 'failure') {
							const data = result.data as { error?: string };
							toast.error(data?.error || 'Failed to send email');
						}
						await update();
						resending = false;
					};
				}}
			>
				<button
					type="submit"
					disabled={resending}
					class="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50"
				>
					{resending ? 'Sending...' : 'Resend verification email'}
				</button>
			</form>
		</div>

		<p class="text-gray-500 text-sm mt-6">
			Didn't receive the email? Check your spam folder.
		</p>
	</div>
</div>
