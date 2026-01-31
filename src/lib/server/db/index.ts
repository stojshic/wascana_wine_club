import { drizzle as drizzleLibsql } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

let db: ReturnType<typeof drizzleLibsql>;

if (tursoUrl && tursoAuthToken) {
	// Production: Use Turso
	const client = createClient({
		url: tursoUrl,
		authToken: tursoAuthToken
	});
	db = drizzleLibsql(client, { schema });
} else {
	// Local development: Use libsql with local file
	const client = createClient({
		url: 'file:./data/wine-club.db'
	});
	db = drizzleLibsql(client, { schema });
}

export { db };
