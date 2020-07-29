import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
  } from "typeorm";
  import { Livraison } from "./Livraison";
  
  @Index("DateLimite_pk", ["idLimiteDat"], { unique: true })
  @Entity("DateLimite")
  export class DateLimite {
      @PrimaryGeneratedColumn({ type: "integer", name: "id_limite_dat" })
    idLimiteDat: number;
  
    @Column("varchar", { name: "limite_dat", length: 50 })
    limiteDat: string;

    @Column("boolean", {name: "est_supprime"})
    estSupprime: boolean;
  
  
    @OneToMany(() => Livraison, (livraison) => livraison.idLimiteDat)
    livraisons: Livraison[];
  }
  