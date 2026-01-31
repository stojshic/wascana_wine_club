import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { wines } from '../src/lib/server/db/schema';

const sqlite = new Database('./data/wine-club.db');
const db = drizzle(sqlite);

const sampleWines = [
	{
		name: 'Château Margaux 2018',
		description: 'A prestigious Bordeaux wine with elegant tannins, notes of blackcurrant, violet, and subtle oak. This full-bodied red offers a long, sophisticated finish that exemplifies the excellence of Margaux.',
		price: 450.00,
		imageUrl: null,
		stock: 6
	},
	{
		name: 'Opus One 2019',
		description: 'A Napa Valley icon blending Cabernet Sauvignon with Merlot. Rich flavors of dark cherry, cassis, and espresso with silky tannins. Perfect for special occasions.',
		price: 380.00,
		imageUrl: null,
		stock: 12
	},
	{
		name: 'Cloudy Bay Sauvignon Blanc 2023',
		description: 'Fresh and vibrant from Marlborough, New Zealand. Citrus and passion fruit aromas with a crisp, refreshing palate. Ideal for seafood pairings.',
		price: 28.00,
		imageUrl: null,
		stock: 24
	},
	{
		name: 'Penfolds Grange 2018',
		description: 'Australia\'s most celebrated wine. Intense shiraz with layers of dark fruit, chocolate, and spice. A collector\'s dream with exceptional aging potential.',
		price: 750.00,
		imageUrl: null,
		stock: 3
	},
	{
		name: 'Whispering Angel Rosé 2023',
		description: 'Elegant Provence rosé with pale pink hue. Delicate notes of fresh strawberry, white peach, and floral hints. Perfect for summer afternoons.',
		price: 24.00,
		imageUrl: null,
		stock: 36
	},
	{
		name: 'Barolo Riserva 2017',
		description: 'The "King of Wines" from Piedmont, Italy. Complex aromas of rose, tar, and truffle. Powerful yet refined with firm tannins that promise decades of evolution.',
		price: 95.00,
		imageUrl: null,
		stock: 8
	},
	{
		name: 'Dom Pérignon 2013',
		description: 'Legendary Champagne with fine bubbles and extraordinary depth. Notes of almond, cocoa, and white fruit. The epitome of celebration.',
		price: 220.00,
		imageUrl: null,
		stock: 15
	},
	{
		name: 'Caymus Cabernet Sauvignon 2021',
		description: 'Napa Valley classic with rich, ripe fruit character. Dark berry flavors with vanilla and toasted oak. Approachable now but will age beautifully.',
		price: 85.00,
		imageUrl: null,
		stock: 0
	}
];

async function seed() {
	console.log('Seeding database with sample wines...');

	for (const wine of sampleWines) {
		await db.insert(wines).values(wine);
		console.log(`  Added: ${wine.name}`);
	}

	console.log('Done! Added', sampleWines.length, 'wines.');
}

seed().catch(console.error);
