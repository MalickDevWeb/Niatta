const fs = require('fs');
const path = require('path');

// Pour charger .env localement
try {
  require('dotenv').config();
} catch (e) {
  // Ignorer si dotenv n'est pas installé, les variables d'environnement
  // système (comme sur Vercel) seront utilisées.
}

const targetPath = path.join(__dirname, 'src', 'environments', 'environment.ts');
const targetProdPath = path.join(__dirname, 'src', 'environments', 'environment.prod.ts');

const apiUrl = process.env.API_URL || 'http://localhost:3000/api';

const envConfigFile = `export const environment = {
  production: ${process.env.NODE_ENV === 'production' ? 'true' : 'false'},
  apiUrl: '${apiUrl}'
};
`;

console.log('Generating environment.ts with API_URL:', apiUrl);

fs.writeFileSync(targetPath, envConfigFile);
fs.writeFileSync(targetProdPath, envConfigFile);

console.log('environment.ts generated successfully');
