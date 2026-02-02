<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
	let loading = $state(false);
</script>

<div class="max-w-2xl">
	<div class="mb-8">
		<a href="/admin/users" class="text-gold-600 hover:text-gold-700 text-sm">← Back to users</a>
		<h1 class="text-3xl font-bold text-gray-900 mt-2">Add New User</h1>
	</div>

	<div class="bg-white rounded-xl shadow p-6">
		{#if form?.success}
			<div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
				Invitation sent to {form.email}! They will receive an email to set up their account.
			</div>
		{/if}

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
				<label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
				<input
					type="text"
					id="name"
					name="name"
					value={form?.name ?? ''}
					required
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
					placeholder="John Doe"
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
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
					placeholder="john@example.com"
				/>
			</div>

			<div>
				<label for="role" class="block text-sm font-medium text-gray-700 mb-1">Role</label>
				<select
					id="role"
					name="role"
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
				>
					<option value="customer" selected={form?.role !== 'admin'}>Member</option>
					<option value="admin" selected={form?.role === 'admin'}>Admin</option>
				</select>
			</div>

			<div class="flex gap-3 pt-4">
				<button
					type="submit"
					disabled={loading}
					class="bg-gold-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gold-700 transition disabled:opacity-50"
				>
					{loading ? 'Sending Invite...' : 'Send Invite'}
				</button>
				<a
					href="/admin/users"
					class="px-6 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition"
				>
					Cancel
				</a>
			</div>
		</form>
	</div>
</div>
