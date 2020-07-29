import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Livraison } from "./Livraison";

@Index("Etats_pk", ["idEta"], { unique: true })
@Entity("Etats")
export class Etats {
    @PrimaryGeneratedColumn({ type: "integer", name: "id_eta" })
    idEta: number;

    @Column("varchar", { name: "etat_eta", length: 30 })
    etatEta: string;

    @Column("integer",{name: "ordre_eta",nullable:false})
    ordreEta: number

    @OneToMany(() => Livraison, (livraison) => livraison.idEtaEtats)
    livraisons: Livraison[];
}
