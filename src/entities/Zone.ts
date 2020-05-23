import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Livraison } from "./Livraison";

@Index("Zone_pk", ["idZon"], { unique: true })
@Entity("Zone", { schema: "public" })
export class Zone {
    @PrimaryGeneratedColumn({ type: "integer", name: "id_zon" })
    idZon: number;

    @Column("character varying", { name: "nom_zon", length: 50 })
    nomZon: string;

    @Column("double precision", { name: "tarif_zon" })
    tarifZon: number;

    @OneToMany(() => Livraison, (livraison) => livraison.idZonDepart)
    livraisons: Livraison[];

    @OneToMany(() => Livraison, (livraison) => livraison.idZonArrivee)
    livraisons2: Livraison[];
    
}
