export interface Categorie {
    id: number;
    nom: string;
}

export interface Plat {
    id: number;
    nom: string;
    description: string;
    /** Montant envoyé par l'API sous forme de chaîne : "6000.00" */
    prix: string;
    categorie_id: number;
    disponible: boolean;
    categorie: Categorie | null;
}

export interface LignePanier {
    plat: Plat;
    quantite: number;
}

export interface LigneCommandeInput {
    plat_id: number;
    quantite: number;
}

export interface NouvelleCommande {
    table: number;
    lignes: LigneCommandeInput[];
}

export interface LigneCommande extends LigneCommandeInput {
    nom: string;
    prix_unitaire: string;
    sous_total: string;
}

export interface Commande {
    id: number;
    table: number;
    date: string;
    statut: string;
    total: string;
    lignes: LigneCommande[];
}
