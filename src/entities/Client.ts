import { Column, Entity, Index, OneToMany } from "typeorm";
import { Livraison } from "./Livraison";

@Index("Client_pk", ["idCli"], { unique: true })
@Entity("Client", { schema: "public" })
export class Client {
  @Column("integer", { primary: true, name: "id_cli" })
  idCli: number;

  @Column("character varying", { name: "nom_cli", nullable:false, length: 50 })
  nomCli: string;

  @Column("character varying", { name: "prenom_cli",nullable:false, length: 30 })
  prenomCli: string;

  @Column("character varying", { name: "num_tel_cli", nullable:false, length: 10 })
  numTelCli: string;

  @Column("character varying", { name: "email_cli",nullable:false, length: 30 })
  emailCli: string;

  @Column("character varying", { name: "pass_cli", nullable:false, length: 50 })
  passCli: string;

  @Column("character varying", { name: "confirmation_cli", nullable: true, length: 6 })
  confirmationCli: string;

  @OneToMany(() => Livraison, (livraison) => livraison.idCliClient)
  livraisons: Livraison[];
}
