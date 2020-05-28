import { createConnection } from 'typeorm';
import { ormconfig } from './config';
import { Admin } from './entities/Admin';
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
})()

