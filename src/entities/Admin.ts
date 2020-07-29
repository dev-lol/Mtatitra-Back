import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Coursier } from "./Coursier";

@Index("Admin_pk", ["idAdm"], { unique: true })
@Entity("Admin")
export class Admin {
    @PrimaryGeneratedColumn({ type: "integer", name: "id_adm" })
    idAdm: number;

    @Column("varchar", { name: "username_adm", length: 30 })
    usernameAdm: string;

    @Column("varchar", { name: "pass_adm", length: 100 })
    passAdm: string;

    @Column("varchar", { name: "email_adm", length: 50 })
    emailAdm: string;

    @OneToMany(() => Coursier, (coursier) => coursier.idAdmAdmin)
    coursiers: Coursier[];
}
