import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

// Debug logging
console.log('DB Init - TURSO_DATABASE_URL exists:', !!tursoUrl);
console.log('DB Init - TURSO_AUTH_TOKEN exists:', !!tursoAuthToken);
if (tursoUrl) {
	console.log('DB Init - URL prefix:', tursoUrl.substring(0, 30) + '...');
}

const client = createClient(
	tursoUrl && tursoAuthToken
		? { url: tursoUrl, authToken: tursoAuthToken }
		: { url: 'file:./data/wine-club.db' }
);

export const db = drizzle(client, { schema });
