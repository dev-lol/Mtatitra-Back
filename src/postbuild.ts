import { createConnection } from 'typeorm';
import { ormconfig } from './config';
import { Admin } from './entities/Admin';
import { Client } from './entities/Client';
import { Coursier } from './entities/Coursier';
(async () => {
    let connection = await createConnection(ormconfig)
    let adminRepository = connection.getRepository(Admin)
    if ((await adminRepository.count()) < 1) {
        let admin = adminRepository.create({
            usernameAdm: "admin",
            passAdm: process.env.ADMIN_PASS,
            emailAdm: process.env.ADMIN_MAIL
        })
        await adminRepository.save(admin)
    }
    let clientRepository = connection.getRepository(Client)
    if((await clientRepository.count() < 1)){
        let client = clientRepository.create({
            nomCli: "RAJAOMARIA",
            prenomCli: "Jaona",
            adresseCli: "IB 90 Andraivato Ambatofotsy Gara Antananarivo 101",
            confirmationCli: "",
            emailCli: "client_test@client.com",
            passCli: "$2b$12$NkZMgOfQDiTueABJ8.BCrujsjNlbEDZ2WL8ns1PTtWMX49l3u802G",
            numTelCli: "0344822017"
        })
        await clientRepository.save(client)
    }
})()

