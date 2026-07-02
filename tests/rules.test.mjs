// Firestore Security Rules unit tests — run against the Firestore emulator.
// Usage: npx firebase emulators:exec --only firestore --project demo-lumiree "node tests/rules.test.mjs"
import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'node:fs';
import { doc, setDoc, getDoc, updateDoc, deleteDoc, collection, addDoc } from 'firebase/firestore';

const SUPER = 'lexcorp0777@gmail.com';
let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
    passed += 1;
    console.log(`  ✓ ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`  ✗ ${name}\n    ${error.message}`);
  }
}

const env = await initializeTestEnvironment({
  projectId: 'demo-lumiree',
  firestore: { rules: readFileSync('firestore.rules', 'utf8'), host: '127.0.0.1', port: 8080 },
});

const anon = env.unauthenticatedContext().firestore();
const superAdmin = env.authenticatedContext('super-uid', { email: SUPER }).firestore();
const claimAdmin = env.authenticatedContext('admin-uid', { email: 'admin@x.com', role: 'admin' }).firestore();
const customer = env.authenticatedContext('cust-uid', { email: 'cust@x.com' }).firestore();
const disabledAdmin = env.authenticatedContext('dis-uid', { email: 'dis@x.com' }).firestore();

// Seed data with rules disabled
await env.withSecurityRulesDisabled(async (ctx) => {
  const db = ctx.firestore();
  await setDoc(doc(db, 'users/admin-uid'), { uid: 'admin-uid', email: 'admin@x.com', displayName: 'A', role: 'admin', status: 'active', wishlist: [], recentlyViewed: [], createdAt: new Date() });
  await setDoc(doc(db, 'users/dis-uid'), { uid: 'dis-uid', email: 'dis@x.com', displayName: 'D', role: 'admin', status: 'inactive', wishlist: [], recentlyViewed: [], createdAt: new Date() });
  await setDoc(doc(db, 'users/cust-uid'), { uid: 'cust-uid', email: 'cust@x.com', displayName: 'C', role: 'customer', status: 'active', wishlist: [], recentlyViewed: [], createdAt: new Date() });
  await setDoc(doc(db, 'products/p1'), { name: 'P1' });
  await setDoc(doc(db, 'inquiries/i1'), { name: 'X', email: 'x@x.com', message: 'hi', status: 'new', type: 'general', phone: '', createdAt: new Date().toISOString() });
});

console.log('users collection:');
await test('anon cannot read users', () => assertFails(getDoc(doc(anon, 'users/cust-uid'))));
await test('user reads own profile', () => assertSucceeds(getDoc(doc(customer, 'users/cust-uid'))));
await test('customer cannot read another profile', () => assertFails(getDoc(doc(customer, 'users/admin-uid'))));
await test('active claim-admin reads any profile', () => assertSucceeds(getDoc(doc(claimAdmin, 'users/cust-uid'))));
await test('super admin reads any profile', () => assertSucceeds(getDoc(doc(superAdmin, 'users/cust-uid'))));
await test('new customer self-create (role customer) allowed', () =>
  assertSucceeds(setDoc(doc(env.authenticatedContext('new-uid', { email: 'new@x.com' }).firestore(), 'users/new-uid'), {
    uid: 'new-uid', email: 'new@x.com', displayName: 'New', role: 'customer', status: 'active', wishlist: [], recentlyViewed: [], createdAt: new Date(),
  })));
await test('self-create with role admin DENIED without claim', () =>
  assertFails(setDoc(doc(env.authenticatedContext('evil-uid', { email: 'evil@x.com' }).firestore(), 'users/evil-uid'), {
    uid: 'evil-uid', email: 'evil@x.com', displayName: 'Evil', role: 'admin', status: 'active', wishlist: [], recentlyViewed: [], createdAt: new Date(),
  })));
await test('self-create with role admin ALLOWED with claim', () =>
  assertSucceeds(setDoc(doc(env.authenticatedContext('a2-uid', { email: 'a2@x.com', role: 'admin' }).firestore(), 'users/a2-uid'), {
    uid: 'a2-uid', email: 'a2@x.com', displayName: 'A2', role: 'admin', status: 'active', wishlist: [], recentlyViewed: [], createdAt: new Date(),
  })));
await test('customer cannot escalate own role', () =>
  assertFails(updateDoc(doc(customer, 'users/cust-uid'), { role: 'admin' })));
await test('customer can update own wishlist', () =>
  assertSucceeds(updateDoc(doc(customer, 'users/cust-uid'), { wishlist: ['p1'] })));
await env.withSecurityRulesDisabled(async (ctx) => {
  await setDoc(doc(ctx.firestore(), 'users/promo-uid'), { uid: 'promo-uid', email: 'promo@x.com', displayName: 'P', role: 'customer', status: 'active', wishlist: [], recentlyViewed: [], createdAt: new Date() });
});
await test('super admin can update any user', () =>
  assertSucceeds(updateDoc(doc(superAdmin, 'users/promo-uid'), { role: 'admin' })));
await test('claim-admin cannot update other users', () =>
  assertFails(updateDoc(doc(claimAdmin, 'users/cust-uid'), { role: 'admin' })));
await test('super admin cannot delete own profile doc', () =>
  assertFails(deleteDoc(doc(superAdmin, 'users/super-uid'))));

console.log('products:');
await test('anon reads products', () => assertSucceeds(getDoc(doc(anon, 'products/p1'))));
await test('anon cannot write products', () => assertFails(setDoc(doc(anon, 'products/p2'), { name: 'X' })));
await test('customer cannot write products', () => assertFails(setDoc(doc(customer, 'products/p2'), { name: 'X' })));
await test('claim-admin writes products', () => assertSucceeds(setDoc(doc(claimAdmin, 'products/p2'), { name: 'X' })));
await test('disabled admin (doc status inactive, no claim) cannot write products', () =>
  assertFails(setDoc(doc(disabledAdmin, 'products/p3'), { name: 'X' })));

console.log('inquiries:');
await test('anon creates valid inquiry', () =>
  assertSucceeds(addDoc(collection(anon, 'inquiries'), {
    type: 'general', name: 'Visitor', email: 'v@x.com', phone: '123', message: 'Hello', status: 'new', createdAt: new Date().toISOString(),
  })));
await test('anon cannot create inquiry with status != new', () =>
  assertFails(addDoc(collection(anon, 'inquiries'), {
    type: 'general', name: 'V', email: 'v@x.com', phone: '', message: 'H', status: 'completed', createdAt: new Date().toISOString(),
  })));
await test('anon cannot create inquiry with extra fields', () =>
  assertFails(addDoc(collection(anon, 'inquiries'), {
    type: 'general', name: 'V', email: 'v@x.com', phone: '', message: 'H', status: 'new', createdAt: new Date().toISOString(), hacked: true,
  })));
await test('anon cannot read inquiries', () => assertFails(getDoc(doc(anon, 'inquiries/i1'))));
await test('claim-admin reads inquiries', () => assertSucceeds(getDoc(doc(claimAdmin, 'inquiries/i1'))));

console.log('reviews:');
await test('anon creates pending review', () =>
  assertSucceeds(addDoc(collection(anon, 'reviews'), {
    userName: 'V', userEmail: '', rating: 5, title: '', text: 'Great', productId: '', status: 'pending', createdAt: new Date().toISOString(),
  })));
await test('anon cannot create approved review', () =>
  assertFails(addDoc(collection(anon, 'reviews'), {
    userName: 'V', userEmail: '', rating: 5, title: '', text: 'Great', productId: '', status: 'approved', createdAt: new Date().toISOString(),
  })));
await test('anon cannot approve reviews', () =>
  assertFails(setDoc(doc(anon, 'reviews/r1'), { status: 'approved' }, { merge: true })));

console.log('settings:');
await test('anon reads settings', () => assertSucceeds(getDoc(doc(anon, 'settings/contactInfo'))));
await test('claim-admin updates contactInfo', () =>
  assertSucceeds(setDoc(doc(claimAdmin, 'settings/contactInfo'), { phone: '+911234567890' })));
await test('claim-admin cannot write other settings', () =>
  assertFails(setDoc(doc(claimAdmin, 'settings/other'), { a: 1 })));
await test('super admin writes any settings', () =>
  assertSucceeds(setDoc(doc(superAdmin, 'settings/other'), { a: 1 })));

console.log('emailIndex:');
await test('anon cannot read emailIndex', () => assertFails(getDoc(doc(anon, 'emailIndex/a@x.com'))));
await test('claim-admin reads emailIndex', () => assertSucceeds(getDoc(doc(claimAdmin, 'emailIndex/a@x.com'))));
await test('claim-admin cannot write emailIndex', () =>
  assertFails(setDoc(doc(claimAdmin, 'emailIndex/a@x.com'), { uid: 'x' })));
await test('super admin writes emailIndex', () =>
  assertSucceeds(setDoc(doc(superAdmin, 'emailIndex/a@x.com'), { uid: 'x' })));

await env.cleanup();

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
