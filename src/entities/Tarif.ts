import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique } from "typeorm";
import { Zone } from './Zone';
import { TypeCoursier } from './TypeCoursier';

@Index("Tarif_pk", ["idTar"], { unique: true })
@Unique(["idZonArrivee", "idTypeCouTypeCoursier", "idZonDepart"])
@Entity("Tarif")
export class Tarif {
    @PrimaryGeneratedColumn({ type: "integer", name: "id_tar" })
    idTar: number;

    @Column("double precision", { name: "tarif_tar" })
    tarifTar: number;

    @ManyToOne(() => Zone, (zone) => zone.idZon, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
    })
    @JoinColumn([{ name: "id_zon_Depart", referencedColumnName: "idZon" }])
    idZonDepart: Zone;

    @ManyToOne(() => Zone, (zone) => zone.idZon, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
    })
    @JoinColumn([{ name: "id_zon_Arrivee", referencedColumnName: "idZon" }])
    idZonArrivee: Zone;

    @ManyToOne(() => TypeCoursier, (typeCoursier) => typeCoursier.idTypeCou, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
    })
    @JoinColumn([{ name: "id_type_cou_Type_Coursier", referencedColumnName: "idTypeCou" }])
    idTypeCouTypeCoursier: TypeCoursier;

}
