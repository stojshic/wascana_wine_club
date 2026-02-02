<script lang="ts">
	let { data } = $props();
</script>

<h1 class="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
	<div class="bg-white rounded-xl shadow p-6">
		<p class="text-sm text-gray-600 mb-1">Total Wines</p>
		<p class="text-3xl font-bold text-gold-600">{data.stats.wines}</p>
	</div>
	<div class="bg-white rounded-xl shadow p-6">
		<p class="text-sm text-gray-600 mb-1">Total Users</p>
		<p class="text-3xl font-bold text-blue-600">{data.stats.users}</p>
	</div>
	<div class="bg-white rounded-xl shadow p-6">
		<p class="text-sm text-gray-600 mb-1">Pending Pickup</p>
		<p class="text-3xl font-bold text-yellow-600">{data.stats.pendingReservations}</p>
	</div>
	<div class="bg-white rounded-xl shadow p-6">
		<p class="text-sm text-gray-600 mb-1">Ready for Pickup</p>
		<p class="text-3xl font-bold text-green-600">{data.stats.readyReservations}</p>
	</div>
</div>

<div class="grid md:grid-cols-3 gap-6">
	<a href="/admin/wines" class="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
		<h2 class="text-xl font-semibold text-gray-900 mb-2">Manage Wines</h2>
		<p class="text-gray-600">Add, edit, or remove wines from your catalog</p>
	</a>
	<a href="/admin/reservations" class="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
		<h2 class="text-xl font-semibold text-gray-900 mb-2">Manage Reservations</h2>
		<p class="text-gray-600">View and update reservation statuses</p>
	</a>
	<a href="/admin/users" class="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
		<h2 class="text-xl font-semibold text-gray-900 mb-2">Manage Users</h2>
		<p class="text-gray-600">View users and manage their roles</p>
	</a>
</div>
