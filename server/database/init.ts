import { sql } from '@vercel/postgres';
import { nanoid } from 'nanoid';

export async function initDatabase() {
  try {
    // Create users table with nanoid (only if it doesn't exist)
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(21) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        age INTEGER,
        bio TEXT,
        profile_image_url TEXT,
        location VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create sessions table for token management (only if it doesn't exist)
    await sql`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id VARCHAR(21) PRIMARY KEY,
        user_id VARCHAR(21) REFERENCES users(id) ON DELETE CASCADE,
        token_hash VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;console.log('[SUCCESS] Database tables initialized successfully');
  } catch (error) {
    console.error('[ERROR] Database initialization error:', error);
    throw error;
  }
}

export async function migrateUserIds() {
  try {
    // Find all users with numeric IDs
    const numericUsers = await sql`
      SELECT id, email, password_hash, first_name, last_name, age, bio, profile_image_url, location, created_at
      FROM users 
      WHERE id ~ '^[0-9]+$'
    `;    if (numericUsers.rows.length === 0) {
      console.log('[SUCCESS] No users with numeric IDs found. Migration not needed.');
      return;
    }

    console.log(`[INFO] Found ${numericUsers.rows.length} users with numeric IDs. Starting migration...`);

    for (const user of numericUsers.rows) {
      const oldId = user.id;
      const newId = nanoid();

      // Begin transaction
      await sql`BEGIN`;

      try {
        // Update user_sessions to use new ID
        await sql`
          UPDATE user_sessions 
          SET user_id = ${newId} 
          WHERE user_id = ${oldId}
        `;

        // Update user with new ID
        await sql`
          UPDATE users 
          SET id = ${newId} 
          WHERE id = ${oldId}
        `;        await sql`COMMIT`;
        console.log(`[SUCCESS] Migrated user ${user.email} from ID ${oldId} to ${newId}`);
      } catch (error) {
        await sql`ROLLBACK`;
        console.error(`[ERROR] Failed to migrate user ${user.email}:`, error);
        throw error;
      }
    }    console.log('[SUCCESS] User ID migration completed successfully');
  } catch (error) {
    console.error('[ERROR] User ID migration failed:', error);
    throw error;
  }
}

export async function resetDatabase() {
  try {
    console.log('[WARNING] Resetting database - all data will be lost!');
    
    // Drop and recreate tables
    await sql`DROP TABLE IF EXISTS user_sessions CASCADE`;
    await sql`DROP TABLE IF EXISTS users CASCADE`;
    
    // Recreate tables
    await initDatabase();
    
    console.log('[SUCCESS] Database reset completed');
  } catch (error) {
    console.error('[ERROR] Database reset error:', error);
    throw error;
  }
}

export { sql };

