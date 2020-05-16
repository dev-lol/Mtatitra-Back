import { Column, Entity, Index, OneToMany } from "typeorm";
import { Livraison } from "./Livraison";

@Index("Type Livraison_pk", ["idTypeLiv"], { unique: true })
@Entity("Type_Livraison", { schema: "public" })
export class TypeLivraison {
  @Column("integer", { primary: true, name: "id_type_liv" })
  idTypeLiv: number;

  @Column("character varying", { name: "type_liv", length: 30 })
  typeLiv: string;

  @OneToMany(() => Livraison, (livraison) => livraison.idTypeLivTypeLivraison)
  livraisons: Livraison[];
}
