import { createConnection } from 'typeorm';
import { ormconfig } from './config';
import { Admin } from './entities/Admin';
import { Client } from './entities/Client';
import { Coursier } from './entities/Coursier';
import { TypeCoursier } from './entities/TypeCoursier';
import { Livraison } from './entities/Livraison';
import { Etats } from './entities/Etats';
import { DateLimite } from './entities/DateLimite';
import { TypeLivraison } from './entities/TypeLivraison';
import { Zone } from './entities/Zone';
import { Produit } from './entities/Produit';
import { TypeProduit } from './entities/TypeProduit';
import { Tarif } from './entities/Tarif';
(async () => {
    let connection = await createConnection(ormconfig)
    let adminRepository = connection.getRepository(Admin)
    let coursierRepository = connection.getRepository(Coursier)
    let typeCoursierRepository = connection.getRepository(TypeCoursier)
    let livraisonRepository = connection.getRepository(Livraison)
    let etatRepository = connection.getRepository(Etats)
    let limiteDatRepository = connection.getRepository(DateLimite)
    let typeLivraisonRepository = connection.getRepository(TypeLivraison)
    let zoneRepository = connection.getRepository(Zone)
    let produitRepository = connection.getRepository(Produit)
    let typeProduitRepository = connection.getRepository(TypeProduit)
    let tarifRepository = connection.getRepository(Tarif)

    if ((await adminRepository.count()) < 1) {
        let admin = adminRepository.create({
            usernameAdm: "admin",
            passAdm: process.env.ADMIN_PASS || "$2b$12$JuhQ83ctpS4CPp9bJ5/MO.i.vy7sTnSxVegTfFP4nnSjUy7Egs4x2",
            emailAdm: process.env.ADMIN_MAIL || "admin_test@admin.com"
        })
        let adminSaved = await adminRepository.save(admin)
        let typeCoursier = typeCoursierRepository.create({
            estSupprime: false,
            typeCou: "Voiture"
        })
        let typeCoursierSaved = await typeCoursierRepository.save(typeCoursier)
        typeCoursier = typeCoursierRepository.create({
            estSupprime: false,
            typeCou: "Velo"
        })
        typeCoursierSaved = await typeCoursierRepository.save(typeCoursier)
        typeCoursier = typeCoursierRepository.create({
            estSupprime: false,
            typeCou: "Moto"
        })
        typeCoursierSaved = await typeCoursierRepository.save(typeCoursier)

        let coursier = coursierRepository.create({
            nomCou: "Moto",
            prenomCou: "man",
            usernameCou: "coursier_test@coursier.com",
            numTelCou: "0344822017",
            passCou: "$2b$12$NkZMgOfQDiTueABJ8.BCrujsjNlbEDZ2WL8ns1PTtWMX49l3u802G"
        })
        coursier.idAdmAdmin = adminSaved
        coursier.idTypeCouTypeCoursier = typeCoursierSaved
        await coursierRepository.save(coursier)

        coursier = coursierRepository.create({
            nomCou: "Velo",
            prenomCou: "man",
            usernameCou: "coursier_test2@coursier.com",
            numTelCou: "0344822017",
            passCou: "$2b$12$NkZMgOfQDiTueABJ8.BCrujsjNlbEDZ2WL8ns1PTtWMX49l3u802G"
        })
        coursier.idAdmAdmin = adminSaved
        coursier.idTypeCouTypeCoursier = { ... new TypeCoursier(), idTypeCou: 2 }
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
            numTelCli: "0344822017"
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

    if (await typeLivraisonRepository.count() < 1) {
        let type = new TypeLivraison()
        type.typeLiv = "Type 1"
        type.estSupprime = false
        await typeLivraisonRepository.save(type)
    }

    if (await zoneRepository.count() < 1) {
        const zones = []
        for (let i of [1, 2, 3, 4, 5, 6]) {
            let zone = new Zone()
            zone.nomZon = "Arondissement " + i
            zone.detailsZon = "Details kely oe aiza " + i
            zone.estSupprime = false
            zones.push(zone)
        }
        await zoneRepository.save(zones)
    }

    if (await typeProduitRepository.count() < 1) {
        let type: TypeProduit = new TypeProduit()
        type.typePro = "cosmetiques"
        type.estSupprime = false
        await typeProduitRepository.save(type)
    }

    if (await produitRepository.count() < 3) {
        const pros: Produit[] = []
        for (let i = 0; i < 5; i++) {
            pros.push(new Produit())
            pros[i].consignePro = "dasfasd"
            pros[i].fragilePro = (i % 2) ? true : false
            pros[i].hauteurPro = 10
            pros[i].largeurPro = 5
            pros[i].longueurPro = 30
            pros[i].poidsPro = 2000
            pros[i].prixPro = 30000
            pros[i].idTypeProTypeProduit = await typeProduitRepository.findOne()
        }
        await produitRepository.save(pros)
    }

    if (await tarifRepository.count() < 1) {
        let typeCoursier = await typeCoursierRepository.find()
        let zones = await zoneRepository.find()
        let tarifs = []
        for (let type of typeCoursier) {
            for (let zone of zones) {
                let tarif = new Tarif()
                tarif.idTypeCouTypeCoursier = type
                tarif.idZonZone = zone
                tarif.tarifTar = Math.floor(Math.random() * (10 - 3) - 3) * 1000
                tarifs.push(tarif)
            }
        }
        await tarifRepository.save(tarifs)
    }

    if (await livraisonRepository.count() < 1) {
        let liv: Livraison = new Livraison()
        liv.dateLiv = new Date()
        liv.departLiv = "Androndra"
        liv.descriptionLiv = "Entana kely"
        liv.destinationLiv = "Itaosy"
        liv.expressLiv = true
        liv.idCliClient = await clientRepository.findOne()
        liv.idCouCoursier = await coursierRepository.findOne()
        liv.idEtaEtats = await etatRepository.findOne({ where: { ordreEta: 2 } })
        liv.idLimiteDat = await limiteDatRepository.findOne()
        liv.idTypeLivTypeLivraison = await typeLivraisonRepository.findOne()
        liv.idZonArrivee = await zoneRepository.findOne()
        liv.idZonDepart = await zoneRepository.findOne()
        liv.numRecepLiv = "0333333333"
        liv.sommeRecepLiv = 30000
        liv.produits = await produitRepository.find()
        liv.idTypeCouTypeCoursier = await typeCoursierRepository.findOne(1)
        await livraisonRepository.save(liv)

        liv = new Livraison()
        liv.dateLiv = new Date()
        liv.departLiv = "Androndra"
        liv.descriptionLiv = "Entana kely"
        liv.destinationLiv = "Itaosy"
        liv.expressLiv = true
        liv.idCliClient = await clientRepository.findOne()
        liv.idCouCoursier = await coursierRepository.findOne()
        liv.idEtaEtats = await etatRepository.findOne({ where: { ordreEta: 1 } })
        liv.idLimiteDat = await limiteDatRepository.findOne()
        liv.idTypeLivTypeLivraison = await typeLivraisonRepository.findOne()
        liv.idZonArrivee = await zoneRepository.findOne()
        liv.idZonDepart = await zoneRepository.findOne()
        liv.numRecepLiv = "0333333333"
        liv.sommeRecepLiv = 30000
        liv.produits = await produitRepository.find()
        liv.idTypeCouTypeCoursier = await typeCoursierRepository.findOne(2)
        await livraisonRepository.save(liv)

        liv = new Livraison()
        liv.dateLiv = new Date()
        liv.departLiv = "Androndra"
        liv.descriptionLiv = "Entana kely"
        liv.destinationLiv = "Itaosy"
        liv.expressLiv = true
        liv.idCliClient = await clientRepository.findOne()
        liv.idCouCoursier = await coursierRepository.findOne()
        liv.idLimiteDat = await limiteDatRepository.findOne()
        liv.idTypeLivTypeLivraison = await typeLivraisonRepository.findOne()
        liv.idZonArrivee = await zoneRepository.findOne()
        liv.idZonDepart = await zoneRepository.findOne()
        liv.numRecepLiv = "0333333333"
        liv.sommeRecepLiv = 30000
        liv.produits = await produitRepository.find()
        liv.idTypeCouTypeCoursier = await typeCoursierRepository.findOne(3)
        await livraisonRepository.save(liv)

        let dem = new Date()
        dem.setDate(dem.getDate() + 1);

        liv = new Livraison()
        liv.dateLiv = dem
        liv.departLiv = "Androndra"
        liv.descriptionLiv = "Entana kely"
        liv.destinationLiv = "Itaosy"
        liv.expressLiv = true
        liv.idCliClient = await clientRepository.findOne()
        liv.idCouCoursier = await coursierRepository.findOne()
        liv.idEtaEtats = await etatRepository.findOne({ where: { ordreEta: 2 } })
        liv.idLimiteDat = await limiteDatRepository.findOne()
        liv.idTypeLivTypeLivraison = await typeLivraisonRepository.findOne()
        liv.idZonArrivee = await zoneRepository.findOne()
        liv.idZonDepart = await zoneRepository.findOne()
        liv.numRecepLiv = "0333333333"
        liv.sommeRecepLiv = 30000
        liv.produits = await produitRepository.find()
        liv.idTypeCouTypeCoursier = await typeCoursierRepository.findOne(1)
        await livraisonRepository.save(liv)

        liv = new Livraison()
        liv.dateLiv = dem
        liv.departLiv = "Androndra"
        liv.descriptionLiv = "Entana kely"
        liv.destinationLiv = "Itaosy"
        liv.expressLiv = true
        liv.idCliClient = await clientRepository.findOne()
        liv.idCouCoursier = await coursierRepository.findOne()
        liv.idEtaEtats = await etatRepository.findOne({ where: { ordreEta: 1 } })
        liv.idLimiteDat = await limiteDatRepository.findOne()
        liv.idTypeLivTypeLivraison = await typeLivraisonRepository.findOne()
        liv.idZonArrivee = await zoneRepository.findOne()
        liv.idZonDepart = await zoneRepository.findOne()
        liv.numRecepLiv = "0333333333"
        liv.sommeRecepLiv = 30000
        liv.produits = await produitRepository.find()
        liv.idTypeCouTypeCoursier = await typeCoursierRepository.findOne(2)
        await livraisonRepository.save(liv)

        liv = new Livraison()
        liv.dateLiv = dem
        liv.departLiv = "Androndra"
        liv.descriptionLiv = "Entana kely"
        liv.destinationLiv = "Itaosy"
        liv.expressLiv = true
        liv.idCliClient = await clientRepository.findOne()
        liv.idCouCoursier = await coursierRepository.findOne()
        liv.idLimiteDat = await limiteDatRepository.findOne()
        liv.idTypeLivTypeLivraison = await typeLivraisonRepository.findOne()
        liv.idZonArrivee = await zoneRepository.findOne()
        liv.idZonDepart = await zoneRepository.findOne()
        liv.numRecepLiv = "0333333333"
        liv.sommeRecepLiv = 30000
        liv.produits = await produitRepository.find()
        liv.idTypeCouTypeCoursier = await typeCoursierRepository.findOne(3)
        await livraisonRepository.save(liv)
    }
})()

