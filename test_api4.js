const http = require('http');

const testAPI = (path) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: 3001,
      path: path,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => { 
        console.log(`\n=== ${path} ===`);
        console.log('Status:', res.statusCode);
        try {
          const json = JSON.parse(data);
          console.log('Success:', json.success);
          console.log('Data keys:', json.data ? Object.keys(json.data) : 'no data');
          if (json.data) {
            console.log('Report:', json.data.report ? 'exists' : 'null');
            console.log('wxMetrics:', json.data.wxMetrics ? json.data.wxMetrics.length : 0);
            console.log('nfMetrics:', json.data.nfMetrics ? json.data.nfMetrics.length : 0);
            console.log('slaMetrics:', json.data.slaMetrics ? json.data.slaMetrics.length : 0);
            console.log('topRegions:', json.data.topRegions ? json.data.topRegions.length : 0);
          }
        } catch(e) {
          console.log('Response:', data.substring(0, 500));
        }
        resolve();
      });
    });
    req.on('error', (e) => { console.error('Error:', e.message); reject(e); });
    req.end();
  });
};

(async () => {
  await testAPI('/api/available-dates');
  await testAPI('/api/dashboard/summary?date=2026-03-28');
})();
