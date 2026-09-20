/**
 * test_suite.js – Comprehensive QA & Security Integration Test Suite
 *
 * Tests:
 *  1. Database Seeding & Models Verification
 *  2. Public API Data Leak Audit (Verifies wholesale prices are strictly hidden)
 *  3. Authentication & JWT Issuance (Admin & Supermarket)
 *  4. RBAC & Security Boundaries (401 on missing token, 403 on role breach)
 *  5. Business Logic & Bulk Ordering Engine (MOQ enforcement, total calculation, snapshots)
 *  6. Order Lifecycle State Transitions (Pending -> Approved -> Dispatched -> Delivered)
 *  7. Integration Health (CORS headers, 404 handler, error middleware)
 */

process.env.NODE_ENV = 'test';
require('dotenv').config();

const mongoose = require('mongoose');
const app = require('../src/index');

let server;
let baseUrl;
let adminToken = '';
let supermarketToken = '';
let sampleProduct = null;
let placedOrderId = null;

// Track test results
const testResults = [];

function recordTest(category, name, endpoint, expectedStatus, actualStatus, pass, details = '') {
  testResults.push({
    category,
    name,
    endpoint,
    expectedStatus,
    actualStatus,
    pass,
    details,
  });

  const icon = pass ? '✅ PASS' : '❌ FAIL';
  console.log(`  ${icon} [${actualStatus}] ${name}`);
  if (details) {
    console.log(`         ↳ ${details}`);
  }
}

async function startTestServer() {
  return new Promise((resolve) => {
    // Bind to ephemeral port
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}/api`;
      console.log(`\n🧪 Test Server listening at ${baseUrl}\n`);
      resolve();
    });
  });
}

async function runTests() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  🥜  TASTY NAMKEENS — QA & SECURITY INTEGRATION TEST SUITE');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    await startTestServer();

    // ──────────────────────────────────────────────────────────────────────────
    // SUITE 1: System Health & Public Catalog Security
    // ──────────────────────────────────────────────────────────────────────────
    console.log('\n📦 SUITE 1: Public Catalog & Data Privacy (Price Masking)');

    // Test 1: Health check
    {
      const res = await fetch(`${baseUrl}/health`);
      const body = await res.json();
      recordTest(
        'Public',
        'API Health Check',
        'GET /api/health',
        200,
        res.status,
        res.status === 200 && body.success === true,
        `Status: ${body.message}`
      );
    }

    // Test 2: Public products list (Wholesale price MUST be omitted)
    {
      const res = await fetch(`${baseUrl}/products`);
      const body = await res.json();
      const products = body.data || [];
      sampleProduct = products[0];

      const pricesLeaked = products.some((p) => p.wholesalePrice !== undefined || p.minOrderQty !== undefined);
      recordTest(
        'Security',
        'Public Catalog Price Masking (wholesalePrice & minOrderQty OMITTED)',
        'GET /api/products',
        200,
        res.status,
        res.status === 200 && !pricesLeaked && products.length >= 5,
        `Audited ${products.length} products. Price leak detected: ${pricesLeaked ? 'YES (CRITICAL BUG)' : 'NONE (SAFE)'}`
      );
    }

    // Test 3: Public single product by ID (Price omitted)
    if (sampleProduct) {
      const res = await fetch(`${baseUrl}/products/${sampleProduct._id}`);
      const body = await res.json();
      const p = body.data || {};
      const priceHidden = p.wholesalePrice === undefined;
      recordTest(
        'Security',
        'Public Single Product Price Masking',
        `GET /api/products/${sampleProduct._id}`,
        200,
        res.status,
        res.status === 200 && priceHidden,
        `Product: "${p.name}", Wholesale Price Visible: ${p.wholesalePrice !== undefined ? 'YES' : 'NO'}`
      );
    }

    // Test 4: Public Store Finder endpoint
    if (sampleProduct) {
      const res = await fetch(`${baseUrl}/products/${sampleProduct._id}/stores`);
      const body = await res.json();
      const stores = body.stores || [];
      recordTest(
        'Store Finder',
        'B2C Store Finder for Product',
        `GET /api/products/${sampleProduct._id}/stores`,
        200,
        res.status,
        res.status === 200 && stores.length > 0,
        `Found ${stores.length} physical stores stocking "${sampleProduct.name}"`
      );
    }

    // ──────────────────────────────────────────────────────────────────────────
    // SUITE 2: Authentication & Token Issuance
    // ──────────────────────────────────────────────────────────────────────────
    console.log('\n🔐 SUITE 2: Authentication & Identity Management');

    // Test 5: Supermarket Login
    {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'srilakshmi@example.com',
          password: 'Supermarket@123',
        }),
      });
      const body = await res.json();
      supermarketToken = body.token;
      recordTest(
        'Auth',
        'Supermarket Authentication (Valid Credentials)',
        'POST /api/auth/login',
        200,
        res.status,
        res.status === 200 && !!supermarketToken && body.user.role === 'supermarket',
        `User: ${body.user?.name}, Role: ${body.user?.role}, Token Received: ${!!supermarketToken}`
      );
    }

    // Test 6: Admin Login
    {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@tastynam-keens.com',
          password: 'Admin@TastyNamkeens2024',
        }),
      });
      const body = await res.json();
      adminToken = body.token;
      recordTest(
        'Auth',
        'Admin Master Authentication (Valid Credentials)',
        'POST /api/auth/login',
        200,
        res.status,
        res.status === 200 && !!adminToken && body.user.role === 'admin',
        `User: ${body.user?.name}, Role: ${body.user?.role}, Token Received: ${!!adminToken}`
      );
    }

    // Test 7: Invalid Login Attempt
    {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@tastynam-keens.com',
          password: 'WrongPassword999',
        }),
      });
      const body = await res.json();
      recordTest(
        'Auth',
        'Login Rejection on Invalid Password',
        'POST /api/auth/login',
        401,
        res.status,
        res.status === 401 && body.success === false,
        `Expected 401. Message: "${body.message}"`
      );
    }

    // ──────────────────────────────────────────────────────────────────────────
    // SUITE 3: RBAC & Protected Routes Boundary
    // ──────────────────────────────────────────────────────────────────────────
    console.log('\n🛡️ SUITE 3: Role-Based Access Control (RBAC) & Security Boundaries');

    // Test 8: Unauthenticated access to protected route
    {
      const res = await fetch(`${baseUrl}/orders`);
      const body = await res.json();
      recordTest(
        'Security',
        'Unauthenticated Access Blocked (Missing Token)',
        'GET /api/orders',
        401,
        res.status,
        res.status === 401 && body.success === false,
        `Message: "${body.message}"`
      );
    }

    // Test 9: Malformed / Invalid Token
    {
      const res = await fetch(`${baseUrl}/orders`, {
        headers: { Authorization: 'Bearer fake-invalid-jwt-token-xyz' },
      });
      const body = await res.json();
      recordTest(
        'Security',
        'Invalid Token Rejection',
        'GET /api/orders',
        401,
        res.status,
        res.status === 401 && body.success === false,
        `Message: "${body.message}"`
      );
    }

    // Test 10: Supermarket tries to access Admin Dashboard (Privilege Escalation Check)
    {
      const res = await fetch(`${baseUrl}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${supermarketToken}` },
      });
      const body = await res.json();
      recordTest(
        'Security',
        'Privilege Escalation Block (Supermarket -> Admin Route)',
        'GET /api/admin/dashboard',
        403,
        res.status,
        res.status === 403 && body.success === false,
        `Expected 403 Forbidden. Message: "${body.message}"`
      );
    }

    // Test 11: Supermarket tries to create product (Admin-only)
    {
      const res = await fetch(`${baseUrl}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${supermarketToken}`,
        },
        body: JSON.stringify({
          name: 'Hacked Snack',
          category: 'Bhujia',
          netWeight: '200g',
          wholesalePrice: 10,
        }),
      });
      const body = await res.json();
      recordTest(
        'Security',
        'Admin CRUD Route Guard (Supermarket blocked from POST /products)',
        'POST /api/products',
        403,
        res.status,
        res.status === 403 && body.success === false,
        `Expected 403 Forbidden. Message: "${body.message}"`
      );
    }

    // Test 12: Supermarket accessing wholesale catalog (Price visible to logged-in B2B user)
    {
      const res = await fetch(`${baseUrl}/products/wholesale`, {
        headers: { Authorization: `Bearer ${supermarketToken}` },
      });
      const body = await res.json();
      const products = body.data || [];
      const hasPrices = products.every((p) => typeof p.wholesalePrice === 'number' && p.wholesalePrice > 0);
      recordTest(
        'B2B Wholesale',
        'Wholesale Catalog Access with Pricing (Authenticated Supermarket)',
        'GET /api/products/wholesale',
        200,
        res.status,
        res.status === 200 && hasPrices,
        `Wholesale rates verified for all ${products.length} products.`
      );
    }

    // ──────────────────────────────────────────────────────────────────────────
    // SUITE 4: Business Logic & Bulk Ordering Engine
    // ──────────────────────────────────────────────────────────────────────────
    console.log('\n🛒 SUITE 4: Bulk Ordering Engine & Business Logic');

    // Test 13: MOQ Enforcement Check (Quantity < MOQ must be rejected)
    if (sampleProduct) {
      const res = await fetch(`${baseUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${supermarketToken}`,
        },
        body: JSON.stringify({
          items: [
            {
              productId: sampleProduct._id,
              quantity: 2, // Less than MOQ (minOrderQty is 20 for Aloo Bhujia)
            },
          ],
        }),
      });
      const body = await res.json();
      recordTest(
        'Business Logic',
        'Minimum Order Quantity (MOQ) Violation Rejection',
        'POST /api/orders',
        400,
        res.status,
        res.status === 400 && body.success === false,
        `Quantity 2 rejected. Reason: "${body.message}"`
      );
    }

    // Test 14: Valid Bulk Order Placement & Automatic Total Calculation
    let orderQuantity = 25;
    if (sampleProduct) {
      // Get wholesale price
      const wpRes = await fetch(`${baseUrl}/products/wholesale`, {
        headers: { Authorization: `Bearer ${supermarketToken}` },
      });
      const wpBody = await wpRes.json();
      const liveProduct = wpBody.data.find((p) => p._id === sampleProduct._id);
      const expectedTotal = orderQuantity * liveProduct.wholesalePrice;

      const res = await fetch(`${baseUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${supermarketToken}`,
        },
        body: JSON.stringify({
          items: [
            {
              productId: sampleProduct._id,
              quantity: orderQuantity,
            },
          ],
        }),
      });
      const body = await res.json();
      placedOrderId = body.data?._id;

      const totalMatches = body.data?.totalAmount === expectedTotal;
      const snapshotMatches = body.data?.items[0]?.priceAtOrder === liveProduct.wholesalePrice;

      recordTest(
        'Business Logic',
        'Bulk Order Placement & Price Calculation Validation',
        'POST /api/orders',
        201,
        res.status,
        res.status === 201 && totalMatches && snapshotMatches,
        `Order ID: ${placedOrderId} | Calculated: ₹${body.data?.totalAmount} (Expected: ₹${expectedTotal}) | Snapshot: ₹${body.data?.items[0]?.priceAtOrder}/pkt`
      );
    }

    // Test 15: Supermarket views own order history
    {
      const res = await fetch(`${baseUrl}/orders/my-orders`, {
        headers: { Authorization: `Bearer ${supermarketToken}` },
      });
      const body = await res.json();
      const myOrders = body.data || [];
      const found = myOrders.some((o) => o._id === placedOrderId);
      recordTest(
        'Orders',
        'Supermarket Order History Retrieval',
        'GET /api/orders/my-orders',
        200,
        res.status,
        res.status === 200 && found,
        `Supermarket has ${myOrders.length} order(s). Placed order present: ${found}`
      );
    }

    // Test 16: Admin views all incoming orders
    {
      const res = await fetch(`${baseUrl}/orders`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const body = await res.json();
      const allOrders = body.data || [];
      recordTest(
        'Admin Orders',
        'Admin Order Queue Retrieval',
        'GET /api/orders',
        200,
        res.status,
        res.status === 200 && allOrders.length > 0,
        `Admin retrieved ${allOrders.length} wholesale orders.`
      );
    }

    // Test 17: Order Lifecycle Transition (Pending -> Approved -> Dispatched -> Delivered)
    if (placedOrderId) {
      const transitions = ['Approved', 'Dispatched', 'Delivered'];
      let allTransitionsPassed = true;

      for (const nextStatus of transitions) {
        const res = await fetch(`${baseUrl}/orders/${placedOrderId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            status: nextStatus,
            adminNote: `QA Verified: Marked as ${nextStatus}`,
          }),
        });
        const body = await res.json();
        if (res.status !== 200 || body.data?.status !== nextStatus) {
          allTransitionsPassed = false;
        }
      }

      recordTest(
        'Business Logic',
        'Order Lifecycle Transitions (Approved -> Dispatched -> Delivered)',
        `PUT /api/orders/${placedOrderId}/status`,
        200,
        200,
        allTransitionsPassed,
        `Successfully transitioned lifecycle through: ${transitions.join(' ➔ ')}`
      );
    }

    // Test 18: Invalid status rejection
    if (placedOrderId) {
      const res = await fetch(`${baseUrl}/orders/${placedOrderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          status: 'InvalidFictionalStatus',
        }),
      });
      const body = await res.json();
      recordTest(
        'Business Logic',
        'Invalid Status Transition Rejection',
        `PUT /api/orders/${placedOrderId}/status`,
        400,
        res.status,
        res.status === 400 && body.success === false,
        `Expected 400. Message: "${body.message}"`
      );
    }

    // ──────────────────────────────────────────────────────────────────────────
    // SUITE 5: Integration Health, CORS & Error Handling
    // ──────────────────────────────────────────────────────────────────────────
    console.log('\n🌐 SUITE 5: Integration Health, CORS & Global Error Handling');

    // Test 19: Unknown Route 404 Handler
    {
      const res = await fetch(`${baseUrl}/unregistered-test-route-xyz`);
      const body = await res.json();
      recordTest(
        'Error Handling',
        'Standardized 404 JSON for Unknown Routes',
        'GET /api/unregistered-test-route-xyz',
        404,
        res.status,
        res.status === 404 && body.success === false,
        `Message: "${body.message}"`
      );
    }

    // Test 20: CastError (Invalid Mongoose ObjectId)
    {
      const res = await fetch(`${baseUrl}/products/invalid-non-object-id-12345`);
      const body = await res.json();
      recordTest(
        'Error Handling',
        'CastError Graceful Handling (Invalid ObjectId)',
        'GET /api/products/invalid-non-object-id-12345',
        404,
        res.status,
        res.status === 404 && body.success === false,
        `Message: "${body.message}"`
      );
    }

    // Test 21: CORS Preflight Header for Port 3000
    {
      const res = await fetch(`${baseUrl}/products`, {
        method: 'OPTIONS',
        headers: {
          Origin: 'http://localhost:3000',
          'Access-Control-Request-Method': 'GET',
        },
      });
      const allowOrigin = res.headers.get('access-control-allow-origin');
      recordTest(
        'CORS',
        'CORS Preflight Header for Client Port 3000',
        'OPTIONS /api/products (Origin: http://localhost:3000)',
        204,
        res.status,
        allowOrigin === 'http://localhost:3000',
        `Access-Control-Allow-Origin: "${allowOrigin}"`
      );
    }

    // Test 22: CORS Preflight Header for Port 5173
    {
      const res = await fetch(`${baseUrl}/products`, {
        method: 'OPTIONS',
        headers: {
          Origin: 'http://localhost:5173',
          'Access-Control-Request-Method': 'GET',
        },
      });
      const allowOrigin = res.headers.get('access-control-allow-origin');
      recordTest(
        'CORS',
        'CORS Preflight Header for Vite Port 5173',
        'OPTIONS /api/products (Origin: http://localhost:5173)',
        204,
        res.status,
        allowOrigin === 'http://localhost:5173',
        `Access-Control-Allow-Origin: "${allowOrigin}"`
      );
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Print Test Summary Matrix
    // ──────────────────────────────────────────────────────────────────────────
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  📊 TEST EXECUTION SUMMARY MATRIX');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const totalTests = testResults.length;
    const passedTests = testResults.filter((t) => t.pass).length;
    const failedTests = totalTests - passedTests;

    console.log(`\n  Total Tests Executed : ${totalTests}`);
    console.log(`  Passed               : ${passedTests} ✅`);
    console.log(`  Failed               : ${failedTests} ${failedTests === 0 ? '' : '❌'}`);
    console.log(`  Pass Rate            : ${((passedTests / totalTests) * 100).toFixed(1)}%\n`);

    if (failedTests > 0) {
      console.error('❌ Some tests failed. Please inspect logs above.');
      process.exit(1);
    } else {
      console.log('🎉 ALL INTEGRATION & SECURITY TESTS PASSED WITH 100% SUCCESS RATE!\n');
    }
  } catch (error) {
    console.error('🔥 Fatal error in test runner:', error);
    process.exit(1);
  } finally {
    if (server) {
      server.close();
    }
    mongoose.connection.removeAllListeners();
    await mongoose.disconnect();
    process.exit(0);
  }
}

runTests();
