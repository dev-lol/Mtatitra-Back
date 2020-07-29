import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Livraison } from "./Livraison";
import { Tarif } from './Tarif';
import { Lieu } from './Lieu';

@Index("Zone_pk", ["idZon"], { unique: true })
@Entity("Zone")
export class Zone {
    @PrimaryGeneratedColumn({ type: "integer", name: "id_zon" })
    idZon: number;

    @Column("varchar", { name: "nom_zon", length: 100 })
    nomZon: string;

    @Column("boolean", { name: "est_supprime" })
    estSupprime: boolean


    @OneToMany(() => Lieu, (lieu) => lieu.idZonZone)
    lieu: Lieu[];


    @OneToMany(() => Tarif, (tarif) => tarif.idTar)
    tarifs: Tarif[];
}
