import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Client } from "./Client";
import { Coursier } from "./Coursier";
import { Etats } from "./Etats";
import { Zone } from "./Zone";
import { Produit } from "./Produit";
import { DateLimite } from './DateLimite';
import { TypeCoursier } from './TypeCoursier';

@Index("Livraison_pk", ["idLiv"], { unique: true })
@Entity("Livraison", { schema: "public" })
export class Livraison {
    @PrimaryGeneratedColumn({ type: "integer", name: "id_liv" })
    idLiv: number;

    @Column("character varying", { name: "depart_liv" })
    departLiv: string;

    @Column("character varying", { name: "destination_liv" })
    destinationLiv: string;

    @Column("character varying", { name: "num_recep_liv", length: 10 })
    numRecepLiv: string;

    @Column("date", { name: "date_liv" })
    dateLiv: Date;



    @Column("boolean", { name: "express_liv" })
    expressLiv: Boolean;

    @Column("double precision", {
        name: "somme_recep_liv",
        default: () => "0",
    })
    sommeRecepLiv: number;

    @Column("character varying", { name: "description_liv", nullable: true })
    descriptionLiv: string | null;

    @ManyToOne(() => Client, (client) => client.livraisons, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
        nullable: false
    })
    @JoinColumn([{ name: "id_cli_Client", referencedColumnName: "idCli" }])
    idCliClient: Client;

    @ManyToOne(() => Coursier, (coursier) => coursier.livraisons, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
    })
    @JoinColumn([{ name: "id_cou_Coursier", referencedColumnName: "idCou" }])
    idCouCoursier: Coursier;

    @ManyToOne(() => DateLimite, (coursier) => coursier.livraisons, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
        nullable: false
    })
    @JoinColumn([{ name: "id_limite_dat", referencedColumnName: "idLimiteDat" }])
    idLimiteDat: DateLimite;

    @ManyToOne(() => Etats, (etats) => etats.livraisons, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
        nullable: true
    })
    @JoinColumn([{ name: "id_eta_Etats", referencedColumnName: "idEta" }])
    idEtaEtats: Etats;

    @ManyToOne(() => Zone, (zone) => zone.livraisons, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
    })
    @JoinColumn([{ name: "id_zon_depart", referencedColumnName: "idZon" }])
    idZonDepart: Zone;

    @ManyToOne(() => Zone, (zone) => zone.livraisons2, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
        nullable: false
    })
    @JoinColumn([{ name: "id_zon_arrivee", referencedColumnName: "idZon" }])
    idZonArrivee: Zone;

    @OneToMany(() => Produit, (produit) => produit.idLivLivraison, { cascade: true })
    produits: Produit[];

    @ManyToOne(() => TypeCoursier, (type) => type.livraisons, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
        nullable: false
    })
    @JoinColumn([{ name: "id_type_cou_Type Coursier", referencedColumnName: "idTypeCou" }])
    idTypeCouTypeCoursier: TypeCoursier;
}
