import { drizzle as drizzleLibsql } from 'drizzle-orm/libsql';
import { createClient, type Client } from '@libsql/client';
import * as schema from './schema';

let client: Client | null = null;
let _db: ReturnType<typeof drizzleLibsql> | null = null;

function initDb() {
	if (_db) return _db;

	const tursoUrl = process.env.TURSO_DATABASE_URL;
	const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

	if (tursoUrl && tursoAuthToken) {
		client = createClient({
			url: tursoUrl,
			authToken: tursoAuthToken
		});
	} else {
		client = createClient({
			url: 'file:./data/wine-club.db'
		});
	}

	_db = drizzleLibsql(client, { schema });
	return _db;
}

// Use a proxy to lazily initialize the database on first access
export const db = new Proxy({} as ReturnType<typeof drizzleLibsql>, {
	get(_, prop) {
		const database = initDb();
		return (database as Record<string | symbol, unknown>)[prop];
	}
});
