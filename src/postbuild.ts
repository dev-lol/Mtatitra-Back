import { createConnection } from 'typeorm';
import { ormconfig } from './config';
import { Admin } from './entities/Admin';
import { Client } from './entities/Client';
import { Coursier } from './entities/Coursier';
import { TypeCoursier } from './entities/TypeCoursier';
(async () => {
    let connection = await createConnection(ormconfig)
    let adminRepository = connection.getRepository(Admin)
    let coursierRepository = connection.getRepository(Coursier)
    let typeCoursierRepository = connection.getRepository(TypeCoursier)
    if ((await adminRepository.count()) < 1) {
        let admin = adminRepository.create({
            usernameAdm: "admin",
            passAdm: process.env.ADMIN_PASS,
            emailAdm: process.env.ADMIN_MAIL
        })
        let adminSaved = await adminRepository.save(admin)
        let typeCoursier = typeCoursierRepository.create({
            estSupprime:false,
            typeCou: "Voiture"
        })
        let typeCoursierSaved = await typeCoursierRepository.save(typeCoursier)

        let coursier =  coursierRepository.create({
            nomCou: "TEST",
            prenomCou: "lol",
            usernameCou: "coursier_test@coursier.com",
            numTelCou: "0344822017",
            passCou: "$2b$12$NkZMgOfQDiTueABJ8.BCrujsjNlbEDZ2WL8ns1PTtWMX49l3u802G"
        })
        coursier.idAdmAdmin = adminSaved
        coursier.idTypeCouTypeCoursier = typeCoursierSaved
        await coursierRepository.save(coursier)
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

