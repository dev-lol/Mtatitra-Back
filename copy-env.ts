const fs = require('fs-extra')
fs.ensureFile(".env").then(async () => {
    await Promise.all([
        fs.copy(".env", "./Mtatitra-Front/.env"),
        fs.copy(".env", "./Mtatitra-backoffice/.env"),
    ])
})