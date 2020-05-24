import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Livraison } from "./Livraison";

@Index("Etats_pk", ["idEta"], { unique: true })
@Entity("Etats", { schema: "public" })
export class Etats {
    @PrimaryGeneratedColumn({ type: "integer", name: "id_eta" })
    idEta: number;

    @Column("character varying", { name: "etat_eta", length: 30 })
    etatEta: string;

    @OneToMany(() => Livraison, (livraison) => livraison.idEtaEtats)
    livraisons: Livraison[];
}
