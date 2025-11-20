/**
 * Frontend-Backend Connection Check
 * Run: node check-backend-connection.js
 * 
 * This script checks if the frontend can communicate with the backend API.
 */

const http = require('http');

// Use the same API base URL as the frontend app
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE_URL);
    
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      const bodyString = JSON.stringify(body);
      options.headers['Content-Length'] = Buffer.byteLength(bodyString);
    }

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: parsed,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data,
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

async function checkBackendConnection() {
  log('\n🔍 Checking Frontend-Backend Connection...\n', 'blue');
  log(`📡 Backend URL: ${API_BASE_URL}\n`, 'blue');

  const tests = [
    {
      name: 'Health Check',
      path: '/health',
      method: 'GET',
    },
    {
      name: 'Root Endpoint',
      path: '/',
      method: 'GET',
    },
    {
      name: 'Get All Competencies',
      path: '/api/competencies',
      method: 'GET',
    },
    {
      name: 'Get Parent Competencies',
      path: '/api/competency-subcompetency/parents',
      method: 'GET',
    },
    {
      name: 'Get All Skills',
      path: '/api/skills',
      method: 'GET',
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      log(`Testing: ${test.name}...`, 'yellow');
      const response = await makeRequest(test.path, test.method);

      if (response.status >= 200 && response.status < 300) {
        log(`  ✅ ${test.name}: SUCCESS (${response.status})`, 'green');
        if (response.data && response.data.success !== undefined) {
          log(`     Response: ${JSON.stringify(response.data).substring(0, 100)}...`, 'blue');
        }
        passed++;
      } else {
        log(`  ⚠️  ${test.name}: Status ${response.status}`, 'yellow');
        passed++; // Still counts as connection successful
      }
    } catch (error) {
      log(`  ❌ ${test.name}: FAILED`, 'red');
      log(`     Error: ${error.message}`, 'red');
      
      if (error.code === 'ECONNREFUSED') {
        log(`     💡 Backend is not running on ${API_BASE_URL}`, 'yellow');
        log(`     💡 Start backend with: cd backend && npm run dev`, 'yellow');
      } else if (error.code === 'ENOTFOUND') {
        log(`     💡 Cannot resolve hostname. Check NEXT_PUBLIC_API_BASE_URL`, 'yellow');
      }
      
      failed++;
    }
    console.log('');
  }

  // Summary
  log('\n' + '='.repeat(50), 'blue');
  log(`📊 Test Summary:`, 'blue');
  log(`   ✅ Passed: ${passed}`, 'green');
  log(`   ❌ Failed: ${failed}`, failed > 0 ? 'red' : 'green');
  log('='.repeat(50) + '\n', 'blue');

  if (failed === 0) {
    log('🎉 All tests passed! Frontend-Backend connection is working!', 'green');
    process.exit(0);
  } else {
    log('⚠️  Some tests failed. Check the errors above.', 'yellow');
    process.exit(1);
  }
}

// Run the check
checkBackendConnection().catch((error) => {
  log(`\n❌ Unexpected error: ${error.message}`, 'red');
  process.exit(1);
});

