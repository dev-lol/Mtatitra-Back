const writeFile = require('fs').writeFile
const targetPath = './src/environments/environment.ts';
const targetPath2 = './src/environments/environment.prod.ts';
require('dotenv').config();
const envConfigFile = `export const environment = {
    production: false,
    SOCKET_ENDPOINT: "http${process.env.SSL? "s": ""}://${process.env.URL}/admin",
    API_ENDPOINT: "http${process.env.SSL? "s": ""}://${process.env.URL}/api/admin",
  };
`;
const envConfigFile2 = `export const environment = {
    production: true,
    SOCKET_ENDPOINT: "http${process.env.SSL? "s": ""}://${process.env.URL}/admin",
    API_ENDPOINT: "http${process.env.SSL? "s": ""}://${process.env.URL}/api/admin",
  };
 `;

writeFile(targetPath, envConfigFile, function (err) {
   if (err) {
       throw console.error(err);
   } else {
       
   }
});
writeFile(targetPath2, envConfigFile2, function (err) {
    if (err) {
        throw console.error(err);
    } else {
        
    }
 });