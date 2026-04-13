import Dexie from 'dexie';

export const db = new Dexie('CotizadorVoraz');

db.version(1).stores({
  quotations: '++id, customerName, destination, dateCreated, status',
});

// Seed data if needed or initial setup
db.on('populate', () => {
    // Optional seeding
});
