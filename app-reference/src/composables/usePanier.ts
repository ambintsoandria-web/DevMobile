import { ref, computed, watch } from 'vue';
import type { LignePanier, Plat } from '../types/gargote';
import { lire } from '@/services/stockage';
import { ecrire } from '@/services/stockage';

// L'état est déclaré EN DEHORS de la fonction :
// toutes les pages qui appellent usePanier() partagent le même panier.
const lignes = ref<LignePanier[]>([]); // [{ plat, quantite }]

function estPanier(x: unknown): x is LignePanier[] {
  return (
    Array.isArray(x) &&
    x.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        'quantite' in item &&
        typeof item.quantite === 'number' &&
        'plat' in item &&
        typeof item.plat === 'object' &&
        item.plat !== null &&
        'id' in item.plat &&
        typeof item.plat.id === 'number' &&
        'prix' in item.plat &&
        typeof item.plat.prix === 'string'
    )
  );
}
export async function restaurerPanier(): Promise<void> {
  lignes.value = await lire('panier', [], estPanier);
  watch(
    lignes,
    (nouvellesLignes) => {
      ecrire('panier', nouvellesLignes);
    },
    { deep: true }
  );
}

export function usePanier() {
  function ajouter(plat: Plat) {
    const ligne = lignes.value.find((l) => l.plat.id === plat.id);
    if (ligne) {
      ligne.quantite++;
    } else {
      lignes.value.push({ plat, quantite: 1 });
    }
  }

  function changerQuantite(platId: number, delta: number) {
    const ligne = lignes.value.find((l) => l.plat.id === platId);
    if (!ligne) return;
    ligne.quantite += delta;
    if (ligne.quantite <= 0) {
      lignes.value = lignes.value.filter((l) => l.plat.id !== platId);
    }
  }

  function vider() {
    lignes.value = [];
  }

  const nombreArticles = computed(() => lignes.value.reduce((n, l) => n + l.quantite, 0));
  const total = computed(() => lignes.value.reduce((t, l) => t + Number(l.plat.prix) * l.quantite, 0));

  return { lignes, ajouter, changerQuantite, vider, nombreArticles, total };
}
