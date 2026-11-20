# Réponses — Fiche 07

## Q7.1

Le premier diagnostic affichait **85 erreurs**. Les plus fréquentes concernaient le type `never`, surtout à cause des listes déclarées avec `ref([])` sans préciser leur type.

## Q7.2

| Incident | Détecté à l’écriture ? | Message du compilateur (exemple) |
|---|---|---|
| 1. Prix additionnés | Oui avec un formateur limité à `number`, non avec `number \| string`. | `Argument of type 'string' is not assignable to parameter of type 'number'.` |
| 2. Faute de frappe | Oui. | `Property 'nmo' does not exist on type 'Plat'.` |
| 3. API renommée | Oui si le type est aussi mis à jour. | `Property 'nom' does not exist on type 'Plat'.` |
| 4. Mauvais argument | Oui. | `Argument of type 'number' is not assignable to parameter of type 'Plat'.` |
| 5. await oublié | Oui si on utilise la promesse comme le résultat. | `Property 'nom' does not exist on type 'Promise<Plat>'.` |

C’est **l’incident 1** qui passe avec `number | string` : le `+` entre deux chaînes colle les prix au lieu de les additionner.

## Q7.3

En remplaçant `nom` par `libelle` dans le type `Plat`, le compilateur a signalé **9 erreurs**. Il indique directement les usages à corriger. Avec la recherche manuelle, il faut vérifier chaque résultat. Le nombre trouvé en fiche 05 n’est pas disponible ici.

Si seul le serveur change, TypeScript ne détecte rien : il ne vérifie pas le JSON reçu.

## Q7.4

Pour moi, la migration vaut le coup : elle repère des erreurs plus tôt et facilite les modifications. Par contre, elle prend du temps au départ et ne remplace pas les tests, notamment pour les calculs et les réponses de l’API.