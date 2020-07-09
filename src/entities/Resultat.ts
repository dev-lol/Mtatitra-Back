import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Livraison } from './Livraison';

@Index("Type Resultat", ["idRes"], { unique: true })
@Entity("Resultat", { schema: "public" })
export class Resultat {
    @PrimaryGeneratedColumn({ type: "integer", name: "id_type_res" })
    idRes: number;

    @Column("character varying", { name: "type_res", nullable: false, length: 30 })
    typeRes: string;

    @Column("boolean", { name: "est_suprime" })
    estSupprime: boolean

    @OneToMany(() => Livraison, (livraison) => livraison.idResResultat)
    livraisons: Livraison[];
}