require('dotenv').config();
const dns = require('node:dns');
dns.setServers((process.env.DNS_SERVERS || '8.8.8.8,1.1.1.1').split(',').map(x => x.trim()).filter(Boolean));
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readlineSync = require('readline-sync');
const Admin = require('../src/models/admin.model');

async function main() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI missing');
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) throw new Error('JWT_SECRET must be at least 32 characters');
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  if (await Admin.countDocuments() > 0) {
    console.error('An admin account already exists. Initial setup cannot run twice.');
    process.exitCode = 1;
    return;
  }
  console.log('Create the FIRST Vector Engineers Super Admin (no public signup).');
  const displayName = readlineSync.question('Display name: ').trim();
  const email = readlineSync.question('Admin email: ').trim().toLowerCase();
  const password = readlineSync.question('Admin password (hidden): ', { hideEchoBack: true, mask: '*' });
  const confirm = readlineSync.question('Confirm password (hidden): ', { hideEchoBack: true, mask: '*' });
  if (!displayName || displayName.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 12 || password.length > 128 || password !== confirm) {
    throw new Error('Invalid input. Use an email address, display name, and matching password of at least 12 characters.');
  }
  const passwordHash = await bcrypt.hash(password, 12);
  await Admin.create({ displayName, email, passwordHash, role: 'super_admin', isActive: true });
  console.log('Super Admin created successfully. Password not printed or stored in plain text.');
}
main().catch(error => { console.error('Setup failed:', error.message); process.exitCode = 1; })
  .finally(async () => { await mongoose.disconnect(); });
