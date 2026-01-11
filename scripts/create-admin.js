const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dataPath = path.join(__dirname, '../src/data/data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const email = 'info.rknextgen@gmail.com';
const password = 'Krishna@2026#';
const name = 'Admin';

async function addUser() {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        id: 'user_' + Date.now(),
        email,
        password: hashedPassword,
        name,
        role: 'SUPER_ADMIN',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    // Check if user exists
    const existingUserIndex = data.User.findIndex(u => u.email === email);
    if (existingUserIndex !== -1) {
        console.log('User already exists. Updating password...');
        data.User[existingUserIndex].password = hashedPassword;
        data.User[existingUserIndex].role = 'SUPER_ADMIN'; // Ensure role
        data.User[existingUserIndex].updatedAt = new Date().toISOString();
    } else {
        console.log('Creating new user...');
        data.User.push(newUser);
    }

    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    console.log('User added/updated successfully.');
}

addUser();
