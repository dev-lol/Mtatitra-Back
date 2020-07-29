import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Livraison } from "./Livraison";
import { TypeProduit } from "./TypeProduit";

@Index("Produits_pk", ["idPro"], { unique: true })
@Entity("Produit")
export class Produit {
    @PrimaryGeneratedColumn({ type: "integer", name: "id_cli" })
    idPro: number;

    @Column("boolean", { name: "fragile_pro", nullable: false })
    fragilePro: boolean;

    @Column("double precision", {
        name: "longueur_pro",
        nullable: false,
    })
    longueurPro: number;

    @Column("double precision", {
        name: "largeur_pro",
        nullable: false,
    })
    largeurPro: number;

    @Column("double precision", {
        name: "hauteur_pro",
        nullable: false,
    })
    hauteurPro: number;

    @Column("double precision", {
        name: "poids_pro",
        nullable: false,
    })
    poidsPro: number;

    @Column("varchar", {
        name: "consigne_pro",
        nullable: false,
        length: 250,
    })
    consignePro: string | null;

    @Column("double precision", { name: "prix_pro", nullable: false })
    prixPro: number;

    @ManyToOne(() => Livraison, (livraison) => livraison.produits, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
    })
    @JoinColumn([{ name: "id_liv_Livraison", referencedColumnName: "idLiv" }])
    idLivLivraison: Livraison;

    @ManyToOne(() => TypeProduit, (typeProduit) => typeProduit.produits, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
        eager: true
    })
    @JoinColumn([
        { name: "id_type_pro_Type_Produit", referencedColumnName: "idTypePro" },
    ])
    idTypeProTypeProduit: TypeProduit;
}
