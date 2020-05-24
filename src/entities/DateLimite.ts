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
  @Entity("DateLimite", { schema: "public" })
  export class DateLimite {
      @PrimaryGeneratedColumn({ type: "integer", name: "id_limite_dat" })
    idLimiteDat: number;
  
    @Column("character varying", { name: "limite_dat", length: 50 })
    limiteDat: string;
  
  
    @OneToMany(() => Livraison, (livraison) => livraison.idLimiteDat)
    livraisons: Livraison[];
  }
  