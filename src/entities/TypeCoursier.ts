import { Column, Entity, Index, OneToMany } from "typeorm";
import { Coursier } from "./Coursier";

@Index("Type Coursier_pk", ["idTypeCou"], { unique: true })
@Entity("Type_Coursier", { schema: "public" })
export class TypeCoursier {
  @Column("integer", { primary: true, name: "id_type_cou" })
  idTypeCou: number;

  @Column("character varying", { name: "type_cou", length: 30 })
  typeCou: string;

  @OneToMany(() => Coursier, (coursier) => coursier.idTypeCouTypeCoursier)
  coursiers: Coursier[];
}
