import { createConnection, Between } from 'typeorm';
import { ormconfig } from './config';
import { Admin } from './entities/Admin';
import { TypeCoursier } from './entities/TypeCoursier';
import { DateLimite } from './entities/DateLimite';
(async () => {
    let connection = await createConnection({ ...ormconfig, synchronize: true })
    let adminRepository = connection.getRepository(Admin)
    let typeCoursierRepository = connection.getRepository(TypeCoursier)
    let limiteDatRepository = connection.getRepository(DateLimite)

    if ((await adminRepository.count()) < 1) {
        let admin = adminRepository.create({
            usernameAdm: "admin",
            passAdm: "$2b$12$JuhQ83ctpS4CPp9bJ5/MO.i.vy7sTnSxVegTfFP4nnSjUy7Egs4x2",
            emailAdm: "admin_2020@mtatitra.mg"
        })
        let adminSaved = await adminRepository.save(admin)
        let typeCoursier = typeCoursierRepository.create({
            poidsMaxTypeCou: 20,
            estSupprime: false,
            typeCou: "Voiture",
        })
        let typeCoursierSaved = await typeCoursierRepository.save(typeCoursier)
        typeCoursier = typeCoursierRepository.create({
            estSupprime: false,
            typeCou: "Velo",
            poidsMaxTypeCou: 20,
        })
        typeCoursierSaved = await typeCoursierRepository.save(typeCoursier)
        typeCoursier = typeCoursierRepository.create({
            estSupprime: false,
            typeCou: "Moto",
            poidsMaxTypeCou: 20,
        })
        typeCoursierSaved = await typeCoursierRepository.save(typeCoursier)
    }


    if (await limiteDatRepository.count() < 1) {
        let limites = []
        let limite = new DateLimite()
        limite.limiteDat = "Avant midi"
        limite.estSupprime = false
        limites.push(limite)
        let limite1 = new DateLimite()
        limite1.limiteDat = "Avant 16h 30"
        limite1.estSupprime = false
        limites.push(limite1)
        await limiteDatRepository.save(limites)
    }
    process.exit()
})().catch(error => console.log(error))