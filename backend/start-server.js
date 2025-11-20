/**
 * Start server with better error handling
 */

require('dotenv').config();
const app = require('./src/index');

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  if (err.message.includes('ECONNREFUSED') || err.message.includes('timeout')) {
    console.error('\n💡 Database connection issue detected!');
    console.error('   Please check:');
    console.error('   1. DATABASE_URL in backend/.env is correct');
    console.error('   2. Supabase project is active');
    console.error('   3. Network connectivity');
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

