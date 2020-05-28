import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Livraison } from "./Livraison";

@Index("Type Livraison_pk", ["idTypeLiv"], { unique: true })
@Entity("Type_Livraison", { schema: "public" })
export class TypeLivraison {
    @PrimaryGeneratedColumn({ type: "integer", name: "id_type_liv" })
    idTypeLiv: number;

    @Column("character varying", { name: "type_liv", length: 30 })
    typeLiv: string;
    
    @Column("boolean", {name: "est_suprime"})
    estSupprime: boolean

    @OneToMany(() => Livraison, (livraison) => livraison.idTypeLivTypeLivraison)
    livraisons: Livraison[];
}
