import db from '../config/connection.js';
import  User  from '../models/User.js';  // Ensure correct import
import cleanDB from './cleanDB.js';

import userData from './userData.json' with { type: 'json' };  // Correct import of JSON

const seedDatabase = async (): Promise<void> => {
  try {
    await db();
    await cleanDB();

    // Seed the User collection
    await User.create(userData);  // This should now work
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
