const https = require('https');

const apiKey = process.env.MICROCMS_API_KEY;
const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;

console.log('--- DIAGNOSTIC START ---');
console.log(`Domain: ${serviceDomain}`);
console.log(`API Key Length: ${apiKey ? apiKey.length : 'Missing'}`);

if (!apiKey || !serviceDomain) {
  console.error('❌ Missing env vars');
  process.exit(1);
}

// URL construction
const hostname = serviceDomain.includes('.') ? serviceDomain : `${serviceDomain}.microcms.io`;
console.log(`Target Hostname: ${hostname}`);

const options = {
  hostname: hostname,
  path: '/api/v1/works',
  method: 'GET',
  headers: {
    'X-MICROCMS-API-KEY': apiKey
  }
};

console.log('Sending request...');

const req = https.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`BODY LENGTH: ${data.length}`);
    console.log(`BODY PREVIEW: ${data.substring(0, 200)}...`);
    if (res.statusCode === 200) {
        console.log('✅ CONNECTION SUCCESSFUL');
    } else {
        console.log('❌ CONNECTION FAILED (Status Code)');
    }
    console.log('--- DIAGNOSTIC END ---');
  });
});

req.on('error', (e) => {
  console.error(`❌ REQUEST ERROR: ${e.message}`);
  console.log('--- DIAGNOSTIC END ---');
});

req.end();
