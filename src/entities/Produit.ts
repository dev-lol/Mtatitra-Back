import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Livraison } from "./Livraison";
import { TypeProduit } from "./TypeProduit";

@Index("Produits_pk", ["idPro"], { unique: true })
@Entity("Produit", { schema: "public" })
export class Produit {
    @PrimaryGeneratedColumn({ type: "integer", name: "id_cli" })
    idPro: number;

    @Column("boolean", { name: "fragile_pro", nullable: true })
    fragilePro: boolean | null;

    @Column("double precision", {
        name: "longueur_pro",
        nullable: true,
    })
    longueurPro: number | null;

    @Column("double precision", {
        name: "largeur_pro",
        nullable: true,
    })
    largeurPro: number | null;

    @Column("double precision", {
        name: "hauteur_pro",
        nullable: true,
    })
    hauteurPro: number | null;

    @Column("double precision", {
        name: "poids_pro",
        nullable: true,
    })
    poidsPro: number | null;

    @Column("character varying", {
        name: "consigne_pro",
        nullable: true,
        length: 250,
    })
    consignePro: string | null;

    @Column("smallint", { name: "prix_pro", nullable: true })
    prixPro: number | null;

    @ManyToOne(() => Livraison, (livraison) => livraison.produits, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
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
