import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Admin } from "./Admin";
import { TypeCoursier } from "./TypeCoursier";
import { Livraison } from "./Livraison";

@Index("Coursier_pk", ["idCou"], { unique: true })
@Entity("Coursier")
export class Coursier {
    @PrimaryGeneratedColumn({ type: "integer", name: "id_cou" })
    idCou: number;

    @Column("varchar", { name: "nom_cou", length: 50 })
    nomCou: string;

    @Column("varchar", { name: "prenom_cou", length: 30 })
    prenomCou: string;

    @Column("varchar", { name: "num_tel_cou", length: 10 })
    numTelCou: string;

    @Column("varchar", { name: "num_tel_urgent_cou", length: 10 })
    numTelUrgentCou: string;

    @Column("varchar", { name: "adresse_cou", length: 100 })
    adresseCou: string;

    @Column("varchar", { name: "reference_vehicule_cou", length: 50 })
    referenceVehiculeCou: string;

    @Column("varchar", { name: "username_cou", length: 30 })
    usernameCou: string;

    @Column("varchar", { name: "pass_cou", length: 100 })
    passCou: string;

    @ManyToOne(() => Admin, (admin) => admin.coursiers, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
    })
    @JoinColumn([{ name: "id_adm_Admin", referencedColumnName: "idAdm" }])
    idAdmAdmin: Admin;

    @ManyToOne(() => TypeCoursier, (typeCoursier) => typeCoursier.coursiers, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
    })
    @JoinColumn([
        { name: "id_type_cou_Type_Coursier", referencedColumnName: "idTypeCou" },
    ])
    idTypeCouTypeCoursier: TypeCoursier;

    @OneToMany(() => Livraison, (livraison) => livraison.idCouCoursier)
    livraisons: Livraison[];
}
