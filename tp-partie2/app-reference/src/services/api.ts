/*
 * Tous les appels à l'API passent par ce fichier.
 * Les pages n'utilisent jamais fetch() directement.
 */
import type { Categorie, Commande, NouvelleCommande, Plat } from '@/types/gargote';

export class ErreurApi extends Error {
  constructor(message: string, public statut: number, public details: Record<string, string> = {},) {
    super(message);
  }
}


const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function requete<T>(chemin: string, options: RequestInit = {}): Promise<T> {
  const reponse = await fetch(BASE_URL + chemin, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const donnees = reponse.status === 204 ? null : await reponse.json();

  if (!reponse.ok) {
    throw new ErreurApi(donnees?.message ?? `Erreur HTTP ${reponse.status}`, reponse.status, donnees?.erreurs ?? {});
  }
  return donnees;
}

export default {
  getCategories() {
    return requete<Categorie[]>('/categories');
  },

  getPlats(categorieId?: number | string | null) {
    return requete<Plat[]>(categorieId ? `/plats?categorie=${categorieId}` : '/plats');
  },

  getPlat(id: number | string) {
    return requete<Plat>(`/plats/${id}`);
  },

  getCommandes() {
    return requete<Commande[]>('/commandes');
  },

  creerCommande(commande: NouvelleCommande) {
    return requete<Commande>('/commandes', { method: 'POST', body: JSON.stringify(commande) });
  },
};
