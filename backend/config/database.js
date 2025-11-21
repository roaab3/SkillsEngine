/**
 * Database Configuration (Legacy Compatibility Layer)
 *
 * This file redirects to supabase.js for backward compatibility.
 * All database operations now use Supabase client.
 */

// Re-export everything from supabase.js
module.exports = require('./supabase');
