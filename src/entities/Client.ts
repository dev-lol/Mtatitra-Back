import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Livraison } from "./Livraison";

@Index("Client_pk", ["idCli"], { unique: true })
@Entity("Client", { schema: "public" })
export class Client {
    @PrimaryGeneratedColumn({ type: "integer", name: "id_cli" })
    idCli: number;

    @Column("character varying", { name: "nom_cli", nullable: false, length: 50 })
    nomCli: string;

    @Column("character varying", { name: "prenom_cli", nullable: false, length: 30 })
    prenomCli: string;

    @Column("character varying", { name: "page_fb_cli", nullable: true, length: 100 })
    pageFbCli: string;

    @Column("character varying", { name: "compte_fb_cli", nullable: true, length: 100 })
    compteFbCli: string;

    @Column("character varying", { name: "site_web_cli", nullable: true, length: 100 })
    siteWebCli: string;

    @Column("character varying", { name: "num_tel_cli", nullable: false, length: 10 })
    numTelCli: string;

    @Column("character varying", { name: "adresse_cli", nullable: false, length: 250 })
    adresseCli: string;

    @Column("character varying", { name: "email_cli", nullable: false, length: 30 })
    emailCli: string;

    @Column("character varying", { name: "pass_cli", nullable: false, length: 100 })
    passCli: string;

    @Column("character varying", { name: "confirmation_cli", nullable: true, length: 6 })
    confirmationCli: string;

    @Column("character varying", { name: "reset_code_cli", nullable: true, length: 6 })
    resetCodeCli: string;

    @OneToMany(() => Livraison, (livraison) => livraison.idCliClient)
    livraisons: Livraison[];
}
