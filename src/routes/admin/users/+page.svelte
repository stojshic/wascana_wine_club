<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from '$lib/stores/toast';

	let { data } = $props();
	let updatingId = $state<number | null>(null);
	let deletingId = $state<number | null>(null);

	function formatDate(date: Date | null) {
		if (!date) return '';
		return new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		}).format(date);
	}

	const roleConfig = {
		customer: { label: 'Customer', class: 'bg-gray-100 text-gray-800' },
		admin: { label: 'Admin', class: 'bg-gold-100 text-gold-800' }
	} as const;
</script>

<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
	<h1 class="text-3xl font-bold text-gray-900">Users</h1>
	<p class="text-gray-600">{data.users.length} total users</p>
</div>

{#if data.users.length === 0}
	<div class="bg-white rounded-xl shadow p-8 text-center">
		<p class="text-gray-600">No users found</p>
	</div>
{:else}
	<div class="bg-white rounded-xl shadow overflow-hidden">
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="bg-gray-50 border-b">
					<tr>
						<th class="text-left px-6 py-3 text-sm font-semibold text-gray-900">Name</th>
						<th class="text-left px-6 py-3 text-sm font-semibold text-gray-900">Email</th>
						<th class="text-left px-6 py-3 text-sm font-semibold text-gray-900">Role</th>
						<th class="text-left px-6 py-3 text-sm font-semibold text-gray-900">Joined</th>
						<th class="text-right px-6 py-3 text-sm font-semibold text-gray-900">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y">
					{#each data.users as user}
						<tr class="hover:bg-gray-50">
							<td class="px-6 py-4 font-medium text-gray-900">{user.name}</td>
							<td class="px-6 py-4 text-gray-600">{user.email}</td>
							<td class="px-6 py-4">
								<span class="px-3 py-1 rounded-full text-sm font-medium {roleConfig[user.role].class}">
									{roleConfig[user.role].label}
								</span>
							</td>
							<td class="px-6 py-4 text-sm text-gray-600">
								{formatDate(user.createdAt)}
							</td>
							<td class="px-6 py-4">
								<div class="flex items-center justify-end gap-2">
									<form
										method="POST"
										action="?/updateRole"
										use:enhance={() => {
											updatingId = user.id;
											return async ({ result, update }) => {
												if (result.type === 'success') {
													toast.success('Role updated');
												} else if (result.type === 'failure') {
													const data = result.data as { error?: string };
													toast.error(data?.error || 'Failed to update role');
												}
												await update();
												updatingId = null;
											};
										}}
										class="flex items-center gap-2"
									>
										<input type="hidden" name="userId" value={user.id} />
										<select
											name="role"
											disabled={updatingId === user.id}
											class="px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none disabled:opacity-50"
										>
											<option value="customer" selected={user.role === 'customer'}>Customer</option>
											<option value="admin" selected={user.role === 'admin'}>Admin</option>
										</select>
										<button
											type="submit"
											disabled={updatingId === user.id}
											class="px-3 py-1 text-sm bg-gold-600 text-white rounded-lg hover:bg-gold-700 transition disabled:opacity-50"
										>
											{updatingId === user.id ? '...' : 'Update'}
										</button>
									</form>
									<form
										method="POST"
										action="?/delete"
										use:enhance={() => {
											if (!confirm(`Are you sure you want to delete ${user.name}?`)) {
												return () => {};
											}
											deletingId = user.id;
											return async ({ result, update }) => {
												if (result.type === 'success') {
													toast.success('User deleted');
												} else if (result.type === 'failure') {
													const data = result.data as { error?: string };
													toast.error(data?.error || 'Failed to delete user');
												}
												await update();
												deletingId = null;
											};
										}}
									>
										<input type="hidden" name="userId" value={user.id} />
										<button
											type="submit"
											disabled={deletingId === user.id}
											class="px-3 py-1 text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
										>
											{deletingId === user.id ? '...' : 'Delete'}
										</button>
									</form>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{/if}
