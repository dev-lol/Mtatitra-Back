import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Coursier } from "./Coursier";
import { Client } from './Client';

@Index("Type Coursier_pk", ["idTypeCou"], { unique: true })
@Entity("Type_Coursier", { schema: "public" })
export class TypeCoursier {
    @PrimaryGeneratedColumn({ type: "integer", name: "id_type_cou" })
    idTypeCou: number;

    @Column("character varying", { name: "type_cou", length: 30 })
    typeCou: string;

    @Column("boolean", {name: "est_supprime"})
    estSupprime: boolean

    @OneToMany(() => Coursier, (coursier) => coursier.idTypeCouTypeCoursier)
    coursiers: Coursier[];
}
