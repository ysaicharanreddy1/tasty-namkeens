const mongoose = require('mongoose');
process.env.NODE_ENV = 'test';
require('dotenv').config();
const app = require('../src/index');

async function extract() {
  const server = app.listen(0);
  const port = server.address().port;
  const base = `http://localhost:${port}/api`;

  console.log('----------------------------------------------------');
  // 1. Public Product Fetch
  const pRes = await fetch(`${base}/products`);
  const pJson = await pRes.json();
  console.log(`[PAYLOAD_1_STATUS] ${pRes.status}`);
  console.log('[PAYLOAD_1_JSON]');
  console.log(JSON.stringify({
    success: pJson.success,
    count: pJson.count,
    sampleProduct: pJson.data[0]
  }, null, 2));

  // 2. Supermarket Login
  const smRes = await fetch(`${base}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'srilakshmi@example.com', password: 'Supermarket@123' })
  });
  const smJson = await smRes.json();
  console.log(`[PAYLOAD_2_STATUS] ${smRes.status}`);
  console.log('[PAYLOAD_2_JSON]');
  console.log(JSON.stringify({
    success: smJson.success,
    token: smJson.token ? `${smJson.token.substring(0, 32)}...[VALID_JWT]` : null,
    user: smJson.user
  }, null, 2));

  // 3. Wholesale Order Creation
  const ordRes = await fetch(`${base}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${smJson.token}`
    },
    body: JSON.stringify({
      items: [{ productId: pJson.data[0]._id, quantity: 20 }]
    })
  });
  const ordJson = await ordRes.json();
  console.log(`[PAYLOAD_3_STATUS] ${ordRes.status}`);
  console.log('[PAYLOAD_3_JSON]');
  console.log(JSON.stringify(ordJson, null, 2));

  // 4. Admin Login & Order Status Update
  const admRes = await fetch(`${base}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@tastynam-keens.com', password: 'Admin@TastyNamkeens2024' })
  });
  const admJson = await admRes.json();

  const updRes = await fetch(`${base}/orders/${ordJson.data._id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${admJson.token}`
    },
    body: JSON.stringify({ status: 'Dispatched', adminNote: 'Batch packed & dispatched via Express Cargo' })
  });
  const updJson = await updRes.json();
  console.log(`[PAYLOAD_4_STATUS] ${updRes.status}`);
  console.log('[PAYLOAD_4_JSON]');
  console.log(JSON.stringify(updJson, null, 2));
  console.log('----------------------------------------------------');

  server.close();
  mongoose.connection.removeAllListeners();
  await mongoose.disconnect();
  process.exit(0);
}

extract();
