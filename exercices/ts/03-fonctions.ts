/*
 * 03 — FONCTIONS TYPÉES
 */
import type { Plat } from './02-interfaces.ts';

// A. Paramètre par défaut.
//    formatPrix(500) -> "500 Ar"      formatPrix(2, '€') -> "2 €"
export function formatPrix(prix: number, unite: string | null = null): string {
  if (unite === null) {
    unite = 'Ar';
  }
  return `${prix} ${unite}`;
}

// B. Paramètre facultatif.
//    Renvoie les plats dont le nom contient « mot » (sans tenir compte des majuscules).
//    Si seulementDisponibles vaut true, ne garde que les plats disponibles.
export function rechercher(plats: Plat[], mot: string, seulementDisponibles?: boolean): Plat[] {
  const resultats = seulementDisponibles === true
    ? plats.filter((p) => p.nom.toLocaleLowerCase().includes(mot.toLocaleLowerCase()) && p.disponible === true)
    : plats.filter((p) => p.nom.toLocaleLowerCase().includes(mot.toLocaleLowerCase()));
  return resultats;
}

// C. Type union et rétrécissement (narrowing).
//    versNombre('6000.00') -> 6000      versNombre(12) -> 12
//    Utilisez  typeof valeur === 'string'  pour distinguer les deux cas.
export function versNombre(valeur: number | string): number {
  // TODO
  let res = 0;
  if (typeof valeur === 'string') {
    res = Number(valeur);
  } else {
    res = valeur;
  }
  return res;
}
