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
import { Lieu } from './Lieu';
import { Resultat } from './Resultat';

@Index("Livraison_pk", ["idLiv"], { unique: true })
@Entity("Livraison")
export class Livraison {
    @PrimaryGeneratedColumn({ type: "integer", name: "id_liv" })
    idLiv: number;

    @Column("varchar", { name: "num_recep_liv", length: 10 })
    numRecepLiv: string;

    @Column("date", { name: "date_liv" })
    dateLiv: Date | string;

    @Column("boolean", { name: "express_liv" })
    expressLiv: Boolean;

    @Column("double precision", {
        name: "somme_recep_liv",
        default: () => "0",
    })
    sommeRecepLiv: number;

    @Column("varchar", { name: "description_liv", nullable: true })
    descriptionLiv: string | null;

    @Column("varchar", { name: "rapport_liv", nullable: true })
    rapportLiv: string | null;


    

    @ManyToOne(() => Client, (client) => client.livraisons, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
    })
    @JoinColumn([{ name: "id_cli_Client", referencedColumnName: "idCli" }])
    idCliClient: Client;

    @ManyToOne(() => Coursier, (coursier) => coursier.livraisons, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
    })
    @JoinColumn([{ name: "id_cou_Coursier", referencedColumnName: "idCou" }])
    idCouCoursier: Coursier;

    @ManyToOne(() => Resultat, (resultat) => resultat.livraisons, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
    })
    @JoinColumn([{ name: "id_res_Resultat", referencedColumnName: "idRes" }])
    idResResultat: Resultat;

    @ManyToOne(() => DateLimite, (coursier) => coursier.livraisons, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
    })
    @JoinColumn([{ name: "id_limite_dat", referencedColumnName: "idLimiteDat" }])
    idLimiteDat: DateLimite;

    @ManyToOne(() => Etats, (etats) => etats.livraisons, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
    })
    @JoinColumn([{ name: "id_eta_Etats", referencedColumnName: "idEta" }])
    idEtaEtats: Etats;

    @ManyToOne(() => Lieu, (lieu) => lieu.livraisons, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
    })
    @JoinColumn([{ name: "id_lie_depart", referencedColumnName: "idLie" }])
    idLieDepart: Lieu;

    @ManyToOne(() => Lieu, (lieu) => lieu.livraisons2, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
    })
    @JoinColumn([{ name: "id_lie_arrivee", referencedColumnName: "idLie" }])
    idLieArrivee: Lieu;

    @OneToMany(() => Produit, (produit) => produit.idLivLivraison, { cascade: true })
    produits: Produit[];

    @ManyToOne(() => TypeCoursier, (type) => type.livraisons, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
    })
    @JoinColumn([{ name: "id_type_cou_Type Coursier", referencedColumnName: "idTypeCou" }])
    idTypeCouTypeCoursier: TypeCoursier;
}
