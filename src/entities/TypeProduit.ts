import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Produit } from "./Produit";

@Index("Type Produits_pk", ["idTypePro"], { unique: true })
@Entity("Type_Produit", { schema: "public" })
export class TypeProduit {
    @PrimaryGeneratedColumn({ type: "integer", name: "id_type_pro" })
    idTypePro: number;

    @Column("character varying", { name: "type_pro", nullable: true, length: 30 })
    typePro: string | null;

    @OneToMany(() => Produit, (produit) => produit.idTypeProTypeProduit)
    produits: Produit[];
}
