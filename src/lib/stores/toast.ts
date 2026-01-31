import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
	id: number;
	message: string;
	type: ToastType;
}

function createToastStore() {
	const { subscribe, update } = writable<Toast[]>([]);
	let nextId = 0;

	function add(message: string, type: ToastType = 'info', duration = 4000) {
		const id = nextId++;
		update((toasts) => [...toasts, { id, message, type }]);

		if (duration > 0) {
			setTimeout(() => remove(id), duration);
		}

		return id;
	}

	function remove(id: number) {
		update((toasts) => toasts.filter((t) => t.id !== id));
	}

	return {
		subscribe,
		success: (message: string, duration?: number) => add(message, 'success', duration),
		error: (message: string, duration?: number) => add(message, 'error', duration),
		info: (message: string, duration?: number) => add(message, 'info', duration),
		remove
	};
}

export const toast = createToastStore();
