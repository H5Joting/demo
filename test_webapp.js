const http = require('http');

const testEndpoint = (url, name) => {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`✅ ${name}: HTTP ${res.statusCode}`);
        resolve({ success: true, status: res.statusCode, data: data.substring(0, 200) });
      });
    });
    req.on('error', (err) => {
      console.log(`❌ ${name}: ${err.message}`);
      resolve({ success: false, error: err.message });
    });
    req.setTimeout(5000, () => {
      req.destroy();
      console.log(`⏱️ ${name}: Timeout`);
      resolve({ success: false, error: 'Timeout' });
    });
  });
};

async function runTests() {
  console.log('========================================');
  console.log('  Unified Log Analysis System - Test');
  console.log('========================================\n');

  console.log('📡 Testing Backend API...');
  await testEndpoint('http://127.0.0.1:3001/health', 'Backend Health Check');
  await testEndpoint('http://127.0.0.1:3001/api/clusters', 'Clusters API');
  await testEndpoint('http://127.0.0.1:3001/api/dashboard/summary', 'Dashboard Summary API');

  console.log('\n📡 Testing Frontend Pages...');
  await testEndpoint('http://127.0.0.1:3000/', 'Frontend Homepage');
  await testEndpoint('http://127.0.0.1:3000/query', 'Log Query Page');
  await testEndpoint('http://127.0.0.1:3000/statistics', 'Log Statistics Page');
  await testEndpoint('http://127.0.0.1:3000/settings', 'System Settings Page');

  console.log('\n========================================');
  console.log('  Test Complete!');
  console.log('========================================');
}

runTests();
