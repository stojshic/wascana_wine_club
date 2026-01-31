import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { users } from '../src/lib/server/db/schema';
import { eq } from 'drizzle-orm';

const sqlite = new Database('./data/wine-club.db');
const db = drizzle(sqlite);

const email = process.argv[2];

if (!email) {
	console.error('Usage: npm run db:make-admin <email>');
	process.exit(1);
}

async function makeAdmin() {
	const user = await db.select().from(users).where(eq(users.email, email.toLowerCase())).get();

	if (!user) {
		console.error(`User with email "${email}" not found`);
		process.exit(1);
	}

	await db.update(users).set({ role: 'admin' }).where(eq(users.id, user.id));

	console.log(`✓ User "${user.name}" (${user.email}) is now an admin`);
}

makeAdmin().catch(console.error);
