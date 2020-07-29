import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Livraison } from "./Livraison";

@Index("Client_pk", ["idCli"], { unique: true })
@Entity("Client")
export class Client {
    @PrimaryGeneratedColumn({ type: "integer", name: "id_cli" })
    idCli: number;

    @Column("varchar", { name: "nom_cli", nullable: false, length: 50 })
    nomCli: string;

    @Column("varchar", { name: "prenom_cli", nullable: false, length: 30 })
    prenomCli: string;

    @Column("varchar", { name: "page_fb_cli", nullable: true, length: 100 })
    pageFbCli: string;

    @Column("varchar", { name: "compte_fb_cli", nullable: true, length: 100 })
    compteFbCli: string;

    @Column("varchar", { name: "site_web_cli", nullable: true, length: 100 })
    siteWebCli: string;

    @Column("varchar", { name: "num_tel_cli", nullable: false, length: 10 })
    numTelCli: string;

    @Column("varchar", { name: "adresse_cli", nullable: false, length: 250 })
    adresseCli: string;

    @Column("varchar", { name: "email_cli", nullable: false, length: 30 })
    emailCli: string;

    @Column("varchar", { name: "pass_cli", nullable: false, length: 100 })
    passCli: string;

    @Column("varchar", { name: "confirmation_cli", nullable: true, length: 6 })
    confirmationCli: string;

    @Column("varchar", { name: "reset_code_cli", nullable: true, length: 6 })
    resetCodeCli: string;

    @OneToMany(() => Livraison, (livraison) => livraison.idCliClient)
    livraisons: Livraison[];
}
