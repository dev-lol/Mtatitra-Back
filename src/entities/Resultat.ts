import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Livraison } from './Livraison';

@Index("Type Resultat", ["idRes"], { unique: true })
@Entity("Resultat")
export class Resultat {
    @PrimaryGeneratedColumn({ type: "integer", name: "id_type_res" })
    idRes: number;

    @Column("varchar", { name: "resultat_res", nullable: false, length: 30 })
    resultatRes: string;

    @Column("boolean", { name: "est_supprime", default: () => false })
    estSupprime: boolean

    @OneToMany(() => Livraison, (livraison) => livraison.idResResultat)
    livraisons: Livraison[];
}