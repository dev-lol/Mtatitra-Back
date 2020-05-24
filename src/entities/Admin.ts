import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Coursier } from "./Coursier";

@Index("Admin_pk", ["idAdm"], { unique: true })
@Entity("Admin", { schema: "public" })
export class Admin {
    @PrimaryGeneratedColumn({ type: "integer", name: "id_adm" })
    idAdm: number;

    @Column("character varying", { name: "username_adm", length: 30 })
    usernameAdm: string;

    @Column("character varying", { name: "pass_adm", length: 100 })
    passAdm: string;

    @Column("character varying", { name: "email_adm", length: 50 })
    emailAdm: string;

    @OneToMany(() => Coursier, (coursier) => coursier.idAdmAdmin)
    coursiers: Coursier[];
}
