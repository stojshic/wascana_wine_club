const HASH_ITERATIONS = 100000;
const SALT_LENGTH = 16;
const KEY_LENGTH = 32;

export async function hashPassword(password: string): Promise<string> {
	const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
	const encoder = new TextEncoder();
	const passwordData = encoder.encode(password);

	const keyMaterial = await crypto.subtle.importKey('raw', passwordData, 'PBKDF2', false, [
		'deriveBits'
	]);

	const hash = await crypto.subtle.deriveBits(
		{
			name: 'PBKDF2',
			salt,
			iterations: HASH_ITERATIONS,
			hash: 'SHA-256'
		},
		keyMaterial,
		KEY_LENGTH * 8
	);

	const saltHex = Array.from(salt, (b) => b.toString(16).padStart(2, '0')).join('');
	const hashHex = Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, '0')).join('');

	return `${saltHex}:${hashHex}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
	const [saltHex, hashHex] = storedHash.split(':');
	if (!saltHex || !hashHex) return false;

	const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map((byte) => parseInt(byte, 16)));
	const encoder = new TextEncoder();
	const passwordData = encoder.encode(password);

	const keyMaterial = await crypto.subtle.importKey('raw', passwordData, 'PBKDF2', false, [
		'deriveBits'
	]);

	const hash = await crypto.subtle.deriveBits(
		{
			name: 'PBKDF2',
			salt,
			iterations: HASH_ITERATIONS,
			hash: 'SHA-256'
		},
		keyMaterial,
		KEY_LENGTH * 8
	);

	const computedHashHex = Array.from(new Uint8Array(hash), (b) =>
		b.toString(16).padStart(2, '0')
	).join('');

	return computedHashHex === hashHex;
}
