/**
 * Quick connection check script
 * Run: node check-connection.js
 */

require('dotenv').config();
const { pool } = require('./config/database');

async function checkConnection() {
  console.log('🔍 Checking database connection...\n');
  
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set in .env file');
    console.log('📝 Please set DATABASE_URL in backend/.env');
    process.exit(1);
  }
  
  console.log('✅ DATABASE_URL is set');
  console.log(`📊 Connection string: ${process.env.DATABASE_URL.substring(0, 30)}...`);
  
  try {
    // Test connection
    const result = await pool.query('SELECT NOW() as current_time, version() as pg_version');
    console.log('\n✅ Database connection successful!');
    console.log(`⏰ Server time: ${result.rows[0].current_time}`);
    console.log(`🐘 PostgreSQL version: ${result.rows[0].pg_version.substring(0, 50)}...`);
    
    // Check if tables exist
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log(`\n📋 Found ${tablesResult.rows.length} tables:`);
    tablesResult.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database connection failed!');
    console.error('Error:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Check if DATABASE_URL is correct in backend/.env');
    console.error('   2. Verify Supabase project is active');
    console.error('   3. Check network connectivity');
    console.error('   4. Verify database credentials');
    process.exit(1);
  }
}

checkConnection();

