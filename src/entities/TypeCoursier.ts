import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Coursier } from "./Coursier";
import { Tarif } from './Tarif';
import { Livraison } from './Livraison';

@Index("Type Coursier_pk", ["idTypeCou"], { unique: true })
@Entity("Type_Coursier")
export class TypeCoursier {
    @PrimaryGeneratedColumn({ type: "integer", name: "id_type_cou" })
    idTypeCou: number;

    @Column("varchar", { name: "type_cou", length: 30 })
    typeCou: string;

    @Column("double precision", { name: "poids_max_type_cou" })
    poidsMaxTypeCou: number;

    @Column("boolean", { name: "est_supprime" })
    estSupprime: boolean

    @OneToMany(() => Coursier, (coursier) => coursier.idTypeCouTypeCoursier)
    coursiers: Coursier[];

    @OneToMany(() => Tarif, (tarif) => tarif.idTypeCouTypeCoursier)
    tarifs: Tarif[];

    @OneToMany(() => Livraison, (liv) => liv.idTypeCouTypeCoursier)
    livraisons: Livraison[];

}
