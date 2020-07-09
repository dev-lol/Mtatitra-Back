import { createConnection, Between } from 'typeorm';
import { ormconfig } from './config';
import { Admin } from './entities/Admin';
import { Client } from './entities/Client';
import { Coursier } from './entities/Coursier';
import { TypeCoursier } from './entities/TypeCoursier';
import { Livraison } from './entities/Livraison';
import { Etats } from './entities/Etats';
import { DateLimite } from './entities/DateLimite';
import { Zone } from './entities/Zone';
import { Produit } from './entities/Produit';
import { TypeProduit } from './entities/TypeProduit';
import { Tarif } from './entities/Tarif';
import { Lieu } from './entities/Lieu';
import { Resultat } from './entities/Resultat';
(async () => {
    const config = (process.argv.includes('drop')) ? { ...ormconfig, dropSchema: true } : ormconfig
    let connection = await createConnection(config)
    let adminRepository = connection.getRepository(Admin)
    let coursierRepository = connection.getRepository(Coursier)
    let typeCoursierRepository = connection.getRepository(TypeCoursier)
    let livraisonRepository = connection.getRepository(Livraison)
    let etatRepository = connection.getRepository(Etats)
    let limiteDatRepository = connection.getRepository(DateLimite)
    let zoneRepository = connection.getRepository(Zone)
    let lieuRepository = connection.getRepository(Lieu)
    let produitRepository = connection.getRepository(Produit)
    let typeProduitRepository = connection.getRepository(TypeProduit)
    let tarifRepository = connection.getRepository(Tarif)
    let resultatRepository = connection.getRepository(Resultat)

    if ((await adminRepository.count()) < 1) {
        let admin = adminRepository.create({
            usernameAdm: "admin",
            passAdm: process.env.ADMIN_PASS || "$2b$12$JuhQ83ctpS4CPp9bJ5/MO.i.vy7sTnSxVegTfFP4nnSjUy7Egs4x2",
            emailAdm: process.env.ADMIN_MAIL || "admin_test@admin.com"
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

        let coursier = coursierRepository.create({
            nomCou: "Moto",
            prenomCou: "man",
            numTelUrgentCou: "344444444",
            adresseCou: "Any eeee",
            referenceVehiculeCou: "velo 1",
            usernameCou: "coursier_test@coursier.com",
            numTelCou: "344822017",
            passCou: "$2b$12$NkZMgOfQDiTueABJ8.BCrujsjNlbEDZ2WL8ns1PTtWMX49l3u802G"
        })
        coursier.idAdmAdmin = adminSaved
        coursier.idTypeCouTypeCoursier = typeCoursierSaved
        await coursierRepository.save(coursier)

        coursier = coursierRepository.create({
            nomCou: "Velo",
            prenomCou: "man",
            numTelUrgentCou: "344444444",
            adresseCou: "Any eeee",
            referenceVehiculeCou: "velo 1",
            usernameCou: "coursier_test2@coursier.com",
            numTelCou: "344822017",
            passCou: "$2b$12$NkZMgOfQDiTueABJ8.BCrujsjNlbEDZ2WL8ns1PTtWMX49l3u802G"
        })
        coursier.idAdmAdmin = adminSaved
        coursier.idTypeCouTypeCoursier = { ... new TypeCoursier(), idTypeCou: 2 }
        await coursierRepository.save(coursier)

        coursier = coursierRepository.create({
            nomCou: "Voiture",
            prenomCou: "man",
            numTelUrgentCou: "344444444",
            adresseCou: "Any eeee",
            referenceVehiculeCou: "velo 1",
            usernameCou: "coursier_test3@coursier.com",
            numTelCou: "344822017",
            passCou: "$2b$12$NkZMgOfQDiTueABJ8.BCrujsjNlbEDZ2WL8ns1PTtWMX49l3u802G"
        })
        coursier.idAdmAdmin = adminSaved
        coursier.idTypeCouTypeCoursier = { ... new TypeCoursier(), idTypeCou: 3 }
        await coursierRepository.save(coursier)
    }
    let clientRepository = connection.getRepository(Client)
    if ((await clientRepository.count() < 1)) {
        let client = clientRepository.create({
            nomCli: "RAJAOMARIA",
            prenomCli: "Jaona",
            adresseCli: "IB 90 Andraivato Ambatofotsy Gara Antananarivo 101",
            confirmationCli: "",
            emailCli: "client_test@client.com",
            passCli: "$2b$12$NkZMgOfQDiTueABJ8.BCrujsjNlbEDZ2WL8ns1PTtWMX49l3u802G",
            numTelCli: "344822017"
        })
        await clientRepository.save(client)
    }

    if (await etatRepository.count() < 1) {
        let etats: Etats[] = []
        for (let i = 0; i < 4; i++) {
            let etat: Etats = new Etats()
            etat.etatEta = `Etat numero ${i}`
            etat.ordreEta = i
            etats.push(etat)
        }
        await etatRepository.save(etats)
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

    if (await zoneRepository.count() < 1) {
        const zones = []
        for (let i of [1, 2, 3, 4, 5, 6]) {
            let zone = new Zone()
            zone.nomZon = "Zone " + i
            zone.estSupprime = false
            zones.push(zone)
        }
        await zoneRepository.save(zones)
    }

    if (await lieuRepository.count() < 1) {
        const lieu = []
        for (let i = 0; i < 50; i++) {
            let l = new Lieu()
            l.nomLie = "Lieu " + i
            l.idZonZone = { ... new Zone(), idZon: Math.floor(Math.random() * (6 - 1) + 1) }
            lieu.push(l)
        }
        await lieuRepository.save(lieu)
    }

    if (await typeProduitRepository.count() < 1) {
        let type: TypeProduit = new TypeProduit()
        type.typePro = "cosmetiques"
        type.estSupprime = false
        await typeProduitRepository.save(type)
        type = new TypeProduit()
        type.typePro = "electronique"
        type.estSupprime = false
        await typeProduitRepository.save(type)
    }

    if (await produitRepository.count() < 3) {
        const pros: Produit[] = []
        for (let i = 0; i < 45; i++) {
            pros.push(new Produit())
            pros[i].consignePro = "Consigne " + i
            pros[i].fragilePro = (i % 2) ? true : false
            pros[i].hauteurPro = Math.floor(Math.random() * (10 - 3) + 3)
            pros[i].largeurPro = Math.floor(Math.random() * (10 - 3) + 3)
            pros[i].longueurPro = Math.floor(Math.random() * (10 - 3) + 3)
            pros[i].poidsPro = Math.floor(Math.random() * (10 - 3) + 3) * 1000
            pros[i].prixPro = Math.floor(Math.random() * (10 - 3) + 3) * 1000
            pros[i].idTypeProTypeProduit = { ... new TypeProduit(), idTypePro: Math.floor(Math.random() * 2 + 1) }
        }
        await produitRepository.save(pros)
    }
    if (await resultatRepository.count() < 1) {
        resultatRepository.save([
            {
                resultatRes: "Course annulé"
            },
            {
                resultatRes: "Course retour"
            },
            {
                resultatRes: "Course effectué"
            },
        ])
    }

    if (await tarifRepository.count() < 1) {
        let typeCoursier = await typeCoursierRepository.find()
        let zones = await zoneRepository.find()
        let tarifs = []
        for (let type of typeCoursier) {
            for (let zone of zones) {
                for (let zone2 of zones) {
                    if (zone.idZon > zone2.idZon)
                        continue
                    if (zone.idZon == zone2.idZon) {
                        let tarif = new Tarif()
                        tarif.idTypeCouTypeCoursier = type
                        tarif.idZonDepart = zone
                        tarif.idZonArrivee = zone2
                        tarif.tarifTar = Math.floor(Math.random() * (10 - 3) + 3) * 1000
                        tarifs.push(tarif)
                    } else {
                        let tarif = new Tarif()
                        tarif.idTypeCouTypeCoursier = type
                        tarif.idZonDepart = zone
                        tarif.idZonArrivee = zone2
                        tarif.tarifTar = Math.floor(Math.random() * (10 - 3) + 3) * 1000
                        let tarif2 = new Tarif()
                        tarif2.idTypeCouTypeCoursier = type
                        tarif2.idZonDepart = zone2
                        tarif2.idZonArrivee = zone
                        tarif2.tarifTar = tarif.tarifTar
                        tarifs.push(tarif)
                        tarifs.push(tarif2)
                    }
                }
            }
        }
        await tarifRepository.save(tarifs)
    }

    if (await livraisonRepository.count() < 1) {
        let liv: Livraison = new Livraison()
        liv.dateLiv = new Date()

        liv.descriptionLiv = "Entana kely"

        liv.expressLiv = true
        liv.idCliClient = await clientRepository.findOne()
        liv.idCouCoursier = await coursierRepository.findOne()
        liv.idEtaEtats = await etatRepository.findOne({ where: { ordreEta: 2 } })
        liv.idLimiteDat = await limiteDatRepository.findOne()
        liv.idLieArrivee = { ... new Lieu(), idLie: Math.floor(Math.random() * (45 - 5) + 5) }
        liv.idLieDepart = { ... new Lieu(), idLie: Math.floor(Math.random() * (45 - 5) + 5) }
        liv.numRecepLiv = "343333333"
        liv.sommeRecepLiv = 30000
        liv.produits = await produitRepository.find({ where: { idPro: Between(0, 5) } })
        liv.idTypeCouTypeCoursier = await typeCoursierRepository.findOne(1)
        await livraisonRepository.save(liv)

        liv = new Livraison()
        liv.dateLiv = new Date()

        liv.descriptionLiv = "Entana kely"

        liv.expressLiv = false
        liv.idCliClient = await clientRepository.findOne()
        liv.idCouCoursier = await coursierRepository.findOne()
        liv.idEtaEtats = await etatRepository.findOne({ where: { ordreEta: 1 } })
        liv.idLimiteDat = await limiteDatRepository.findOne()
        liv.idLieArrivee = { ... new Lieu(), idLie: Math.floor(Math.random() * (45 - 5) + 5) }
        liv.idLieDepart = { ... new Lieu(), idLie: Math.floor(Math.random() * (45 - 5) + 5) }
        liv.numRecepLiv = "343333333"
        liv.sommeRecepLiv = 30000
        liv.produits = await produitRepository.find({ where: { idPro: Between(6, 10) } })
        liv.idTypeCouTypeCoursier = await typeCoursierRepository.findOne(2)
        await livraisonRepository.save(liv)

        liv = new Livraison()
        liv.dateLiv = new Date()

        liv.descriptionLiv = "Entana kely"

        liv.expressLiv = true
        liv.idCliClient = await clientRepository.findOne()
        liv.idCouCoursier = await coursierRepository.findOne()
        liv.idLimiteDat = await limiteDatRepository.findOne()
        liv.idLieArrivee = { ... new Lieu(), idLie: Math.floor(Math.random() * (45 - 5) + 5) }
        liv.idLieDepart = { ... new Lieu(), idLie: Math.floor(Math.random() * (45 - 5) + 5) }
        liv.numRecepLiv = "343333333"
        liv.sommeRecepLiv = 30000
        liv.produits = await produitRepository.find({ where: { idPro: Between(11, 15) } })
        liv.idTypeCouTypeCoursier = await typeCoursierRepository.findOne(3)
        await livraisonRepository.save(liv)

        let dem = new Date()
        dem.setDate(dem.getDate() + 1);

        liv = new Livraison()
        liv.dateLiv = dem

        liv.descriptionLiv = "Entana kely"

        liv.expressLiv = false
        liv.idCliClient = await clientRepository.findOne()
        liv.idCouCoursier = await coursierRepository.findOne()
        liv.idEtaEtats = await etatRepository.findOne({ where: { ordreEta: 2 } })
        liv.idLimiteDat = await limiteDatRepository.findOne()
        liv.idLieArrivee = { ... new Lieu(), idLie: Math.floor(Math.random() * (45 - 5) + 5) }
        liv.idLieDepart = { ... new Lieu(), idLie: Math.floor(Math.random() * (45 - 5) + 5) }
        liv.numRecepLiv = "343333333"
        liv.sommeRecepLiv = 30000
        liv.produits = await produitRepository.find({ where: { idPro: Between(16, 20) } })
        liv.idTypeCouTypeCoursier = await typeCoursierRepository.findOne(1)
        await livraisonRepository.save(liv)

        liv = new Livraison()
        liv.dateLiv = dem

        liv.descriptionLiv = "Entana kely"

        liv.expressLiv = true
        liv.idCliClient = await clientRepository.findOne()
        liv.idCouCoursier = await coursierRepository.findOne()
        liv.idEtaEtats = await etatRepository.findOne({ where: { ordreEta: 1 } })
        liv.idLimiteDat = await limiteDatRepository.findOne()
        liv.idLieArrivee = { ... new Lieu(), idLie: Math.floor(Math.random() * (45 - 5) + 5) }
        liv.idLieDepart = { ... new Lieu(), idLie: Math.floor(Math.random() * (45 - 5) + 5) }
        liv.numRecepLiv = "343333333"
        liv.sommeRecepLiv = 30000
        liv.produits = await produitRepository.find({ where: { idPro: Between(21, 25) } })
        liv.idTypeCouTypeCoursier = await typeCoursierRepository.findOne(2)
        await livraisonRepository.save(liv)

        liv = new Livraison()
        liv.dateLiv = dem
        liv.descriptionLiv = "Entana kely"

        liv.expressLiv = false
        liv.idCliClient = await clientRepository.findOne()
        liv.idCouCoursier = await coursierRepository.findOne()
        liv.idLimiteDat = await limiteDatRepository.findOne()
        liv.idLieArrivee = { ... new Lieu(), idLie: Math.floor(Math.random() * (45 - 5) + 5) }
        liv.idLieDepart = { ... new Lieu(), idLie: Math.floor(Math.random() * (45 - 5) + 5) }
        liv.numRecepLiv = "343333333"
        liv.sommeRecepLiv = 30000
        liv.produits = await produitRepository.find({ where: { idPro: Between(26, 30) } })
        liv.idTypeCouTypeCoursier = await typeCoursierRepository.findOne(3)
        await livraisonRepository.save(liv)

        dem.setDate(dem.getDate() - 10);

        liv = new Livraison()
        liv.dateLiv = dem

        liv.descriptionLiv = "Entana kely"

        liv.expressLiv = false
        liv.idCliClient = await clientRepository.findOne()
        liv.idCouCoursier = await coursierRepository.findOne()
        liv.idEtaEtats = await etatRepository.findOne({ where: { ordreEta: 2 } })
        liv.idLimiteDat = await limiteDatRepository.findOne()
        liv.idLieArrivee = { ... new Lieu(), idLie: Math.floor(Math.random() * (45 - 5) + 5) }
        liv.idLieDepart = { ... new Lieu(), idLie: Math.floor(Math.random() * (45 - 5) + 5) }
        liv.numRecepLiv = "343333333"
        liv.sommeRecepLiv = 30000
        liv.produits = await produitRepository.find({ where: { idPro: Between(31, 35) } })
        liv.idTypeCouTypeCoursier = await typeCoursierRepository.findOne(1)
        liv.idResResultat = { ...new Resultat(), idRes: Math.floor(Math.random() * 3 + 1) }
        liv.rapportLiv = " Lorem ipsum dolor sit amet consectetur adipisicing elit.Exercitationem pariatur eum consequatur laboriosam blanditiis, in praesentium dolor atque quod dolores veniam a quos, cum esse et libero perferendis nam repudiandae!"
        await livraisonRepository.save(liv)

        liv = new Livraison()
        liv.dateLiv = dem

        liv.descriptionLiv = "Entana kely"

        liv.expressLiv = true
        liv.idCliClient = await clientRepository.findOne()
        liv.idCouCoursier = await coursierRepository.findOne()
        liv.idEtaEtats = await etatRepository.findOne({ where: { ordreEta: 1 } })
        liv.idLimiteDat = await limiteDatRepository.findOne()
        liv.idLieArrivee = { ... new Lieu(), idLie: Math.floor(Math.random() * (45 - 5) + 5) }
        liv.idLieDepart = { ... new Lieu(), idLie: Math.floor(Math.random() * (45 - 5) + 5) }
        liv.numRecepLiv = "343333333"
        liv.sommeRecepLiv = 30000
        liv.produits = await produitRepository.find({ where: { idPro: Between(36, 40) } })
        liv.idTypeCouTypeCoursier = await typeCoursierRepository.findOne(2)
        liv.idResResultat = { ...new Resultat(), idRes: Math.floor(Math.random() * 3 + 1) }
        liv.rapportLiv = " Lorem ipsum dolor sit amet consectetur adipisicing elit.Exercitationem pariatur eum consequatur laboriosam blanditiis, in praesentium dolor atque quod dolores veniam a quos, cum esse et libero perferendis nam repudiandae!"
        await livraisonRepository.save(liv)

        liv = new Livraison()
        liv.dateLiv = dem
        liv.descriptionLiv = "Entana kely"

        liv.expressLiv = false
        liv.idCliClient = await clientRepository.findOne()
        liv.idCouCoursier = await coursierRepository.findOne()
        liv.idLimiteDat = await limiteDatRepository.findOne()
        liv.idLieArrivee = { ... new Lieu(), idLie: Math.floor(Math.random() * (45 - 5) + 5) }
        liv.idLieDepart = { ... new Lieu(), idLie: Math.floor(Math.random() * (45 - 5) + 5) }
        liv.numRecepLiv = "343333333"
        liv.sommeRecepLiv = 30000
        liv.produits = await produitRepository.find({ where: { idPro: Between(41, 45) } })
        liv.idTypeCouTypeCoursier = await typeCoursierRepository.findOne(3)
        liv.idResResultat = { ...new Resultat(), idRes: Math.floor(Math.random() * 3 + 1) }
        liv.rapportLiv = " Lorem ipsum dolor sit amet consectetur adipisicing elit.Exercitationem pariatur eum consequatur laboriosam blanditiis, in praesentium dolor atque quod dolores veniam a quos, cum esse et libero perferendis nam repudiandae!"
        await livraisonRepository.save(liv)
    }
})().catch(error => console.log(error))

