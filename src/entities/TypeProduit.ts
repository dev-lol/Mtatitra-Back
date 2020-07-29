import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Produit } from "./Produit";

@Index("Type Produits_pk", ["idTypePro"], { unique: true })
@Entity("Type_Produit")
export class TypeProduit {
    @PrimaryGeneratedColumn({ type: "integer", name: "id_type_pro" })
    idTypePro: number;

    @Column("varchar", { name: "type_pro", nullable: false, length: 30 })
    typePro: string;

    @Column("boolean", {name: "est_suprime"})
    estSupprime: boolean

    @OneToMany(() => Produit, (produit) => produit.idTypeProTypeProduit)
    produits: Produit[];
}
