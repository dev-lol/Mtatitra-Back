import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Livraison } from "./Livraison";
import { Tarif } from './Tarif';
import { Lieu } from './Lieu';

@Index("Zone_pk", ["idZon"], { unique: true })
@Entity("Zone", { schema: "public" })
export class Zone {
    @PrimaryGeneratedColumn({ type: "integer", name: "id_zon" })
    idZon: number;

    @Column("character varying", { name: "nom_zon", length: 100 })
    nomZon: string;
    @Column("character varying", { name: "details_zon", length: 100 })
    detailsZon: string;

    @Column("boolean", { name: "est_supprime" })
    estSupprime: boolean

    @OneToMany(() => Livraison, (livraison) => livraison.idZonDepart)
    livraisons: Livraison[];

    @OneToMany(() => Livraison, (livraison) => livraison.idZonArrivee)
    livraisons2: Livraison[];

    @OneToMany(() => Lieu, (lieu) => lieu.idZonZone)
    lieu: Lieu[];


    @OneToMany(() => Tarif, (tarif) => tarif.idTar)
    tarifs: Tarif[];
}
