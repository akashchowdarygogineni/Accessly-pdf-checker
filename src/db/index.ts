/**
 * ===========================================
 * DATABASE CONNECTION CONFIGURATION
 * ===========================================
 * 
 * This file initializes the Drizzle ORM connection to Supabase PostgreSQL.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a Supabase project at https://supabase.com
 * 2. Copy the connection string from Database Settings > Connection pooling
 * 3. Add it to .env.local as DATABASE_URL
 * 4. Run migrations: npx drizzle-kit push
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// ==========================================
// ENVIRONMENT VARIABLES VALIDATION
// ==========================================
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    '❌ Missing DATABASE_URL environment variable. ' +
    'Please add your Neon database connection string to .env.local\n' +
    'Format: postgresql://username:password@host/database?sslmode=require'
  );
}

// ==========================================
// SUPABASE CONNECTION SETUP
// ==========================================
/**
 * Create a PostgreSQL connection using postgres.js
 * This is compatible with Supabase's connection pooler
 */
const sql = postgres(databaseUrl, {
  prepare: false, // Required for Supabase Transaction pooler (pgbouncer)
});

/**
 * Initialize Drizzle ORM with the PostgreSQL connection
 * This is our main database client
 */
export const db = drizzle(sql, { schema });

// ==========================================
// CONNECTION TESTING
// ==========================================
/**
 * Test the database connection
 * Useful for debugging during setup
 */
export async function testDatabaseConnection() {
  try {
    // Try a simple query
    await sql`SELECT 1`;
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.log('📝 Check your DATABASE_URL in .env');
    return false;
  }
}

/**
 * Check if the pdfs table exists
 * Useful for setup verification
 */
export async function checkTablesExist() {
  try {
    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'pdfs'
      );
    `;
    
    const exists = result[0]?.exists;
    
    if (exists) {
      console.log('✅ Table "pdfs" exists');
    } else {
      console.log('❌ Table "pdfs" does not exist');
      console.log('📝 Run: npx drizzle-kit push');
    }
    
    return exists;
  } catch (error) {
    console.error('❌ Error checking tables:', error);
    return false;
  }
}

// ==========================================
// EXPORT SCHEMA FOR QUERIES
// ==========================================
export { schema };

// Export database client as default
export default db;
