import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Zone } from './Zone';
import { Livraison } from './Livraison';

@Index("Lieu_pk", ["idLie"], { unique: true })
@Entity("Lieu")
export class Lieu {
    @PrimaryGeneratedColumn({ type: "integer", name: "id_lie" })
    idLie: number;

    @Column("varchar", { name: "nom_lie", length: 100 })
    nomLie: string;

    @ManyToOne(() => Zone, (zone) => zone.lieu, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
    })
    @JoinColumn([{ name: "id_zon_Zone", referencedColumnName: "idZon" }])
    idZonZone: Zone;

    @OneToMany(() => Livraison, (livraison) => livraison.idLieDepart)
    livraisons: Livraison[];

    @OneToMany(() => Livraison, (livraison) => livraison.idLieArrivee)
    livraisons2: Livraison[];

}
