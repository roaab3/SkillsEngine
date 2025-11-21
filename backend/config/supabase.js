/**
 * Supabase Client Configuration
 *
 * Provides Supabase JS client for all database operations.
 * All repositories use this client for CRUD operations.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase configuration from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

// Validate Supabase configuration
if (!supabaseUrl) {
  console.error('❌ Missing SUPABASE_URL environment variable');
  console.error('💡 Add this to your .env file:');
  console.error('   SUPABASE_URL=https://your-project-ref.supabase.co');
}

if (!supabaseKey) {
  console.error('❌ Missing Supabase API key environment variable');
  console.error('💡 Add one of these to your .env file:');
  console.error('   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (recommended for backend)');
  console.error('   SUPABASE_ANON_KEY=your-anon-key (for public access)');
}

// Create Supabase client
let supabase = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: false, // Don't persist sessions on the server
    },
    db: {
      schema: 'public',
    },
  });

  console.log('✅ Supabase client initialized');
  console.log(`📊 Supabase URL: ${supabaseUrl}`);
} else {
  console.warn('⚠️  Supabase client not initialized - missing configuration');
}

/**
 * Get Supabase client instance
 * @returns {Object} Supabase client
 */
const getSupabaseClient = () => {
  if (!supabase) {
    throw new Error('Supabase client is not initialized. Check your environment variables.');
  }
  return supabase;
};

module.exports = {
  supabase,
  getSupabaseClient,
};
