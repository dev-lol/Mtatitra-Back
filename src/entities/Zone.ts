import { Column, Entity, Index, OneToMany } from "typeorm";
import { Livraison } from "./Livraison";

@Index("Zone_pk", ["idZone"], { unique: true })
@Entity("Zone", { schema: "public" })
export class Zone {
  @Column("integer", { primary: true, name: "id_zone" })
  idZone: number;

  @Column("character varying", { name: "nom_zone", length: 50 })
  nomZone: string;

  @Column("double precision", { name: "tarif_zone"})
  tarifZone: number;

  @OneToMany(() => Livraison, (livraison) => livraison.idZoneZone)
  livraisons: Livraison[];

  @OneToMany(() => Livraison, (livraison) => livraison.idZoneZone2)
  livraisons2: Livraison[];
}
