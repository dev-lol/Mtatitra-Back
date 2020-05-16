import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Admin } from "./Admin";
import { TypeCoursier } from "./TypeCoursier";
import { Livraison } from "./Livraison";

@Index("Coursier_pk", ["idCou"], { unique: true })
@Entity("Coursier", { schema: "public" })
export class Coursier {
  @Column("integer", { primary: true, name: "id_cou" })
  idCou: number;

  @Column("character varying", { name: "nom_cou", length: 50 })
  nomCou: string;

  @Column("character varying", { name: "prenom_cou", length: 30 })
  prenomCou: string;

  @Column("character varying", { name: "num_tel_cou", length: 10 })
  numTelCou: string;

  @Column("character varying", { name: "username_cou", length: 30 })
  usernameCou: string;

  @Column("character varying", { name: "pass_cou", length: 50 })
  passCou: string;

  @ManyToOne(() => Admin, (admin) => admin.coursiers, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "id_adm_Admin", referencedColumnName: "idAdm" }])
  idAdmAdmin: Admin;

  @ManyToOne(() => TypeCoursier, (typeCoursier) => typeCoursier.coursiers, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn([
    { name: "id_type_cou_Type_Coursier", referencedColumnName: "idTypeCou" },
  ])
  idTypeCouTypeCoursier: TypeCoursier;

  @OneToMany(() => Livraison, (livraison) => livraison.idCouCoursier)
  livraisons: Livraison[];
}
