// This script creates a sudo user in the database
import { storage } from '../server/storage.js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function createSudoUser() {
  console.log('=== Create Sudo User ===');
  
  const email = await new Promise(resolve => {
    rl.question('Email: ', resolve);
  });
  
  const password = await new Promise(resolve => {
    rl.question('Password: ', resolve);
  });
  
  const firstName = await new Promise(resolve => {
    rl.question('First Name: ', resolve);
  });
  
  const lastName = await new Promise(resolve => {
    rl.question('Last Name: ', resolve);
  });
  
  try {
    const user = await storage.createUser({
      email,
      password,
      confirmPassword: password,
      firstName,
      lastName,
      role: 'sudo',
      subscriptionTier: 'enterprise'
    });
    
    console.log('Sudo user created successfully:');
    console.log(`ID: ${user.id}`);
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);
    console.log(`Subscription: ${user.subscriptionTier}`);
  } catch (error) {
    console.error('Error creating sudo user:', error.message);
  } finally {
    rl.close();
  }
}

createSudoUser();