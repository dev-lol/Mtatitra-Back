import { Column, Entity, Index, OneToMany } from "typeorm";
import { Produit } from "./Produit";

@Index("Type Produits_pk", ["idTypePro"], { unique: true })
@Entity("Type_Produit", { schema: "public" })
export class TypeProduit {
  @Column("integer", { primary: true, name: "id_type_pro" })
  idTypePro: number;

  @Column("character varying", { name: "type_pro", nullable: true, length: 30 })
  typePro: string | null;

  @OneToMany(() => Produit, (produit) => produit.idTypeProTypeProduit)
  produits: Produit[];
}
