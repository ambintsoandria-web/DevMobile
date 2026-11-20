# Fiche 08 — Une nouvelle fonctionnalité, directement en TypeScript

**Durée** : 2 h · **Slides** : deck « Partie 2 — De JavaScript à TypeScript », section 6, jusqu'à la slide « Au TP : fiche 08 »

## Objectif

Jusqu'ici, vous avez **converti** du code. Vous allez maintenant **écrire** du neuf
en TypeScript, en vous appuyant sur les types pour guider le travail :

1. le panier survit à la fermeture de l'application ;
2. on peut marquer des plats en favoris ;
3. (bonus) on photographie son plat, et on installe l'application sur un téléphone Android.

## 1. Installer le plugin de stockage

```bash
npm install @capacitor/preferences@8.0.1
```

`Preferences` enregistre des paires clé / texte sur le téléphone. Dans un navigateur,
il utilise `localStorage`. Le même code fonctionne donc partout.

## 2. Un service de stockage générique : `src/services/stockage.ts`

Écrivez deux fonctions **génériques** :

```ts
export async function lire<T>(cle: string, defaut: T, valide: (x: unknown) => x is T): Promise<T>
export async function ecrire<T>(cle: string, valeur: T): Promise<void>
```

- `ecrire` convertit la valeur en JSON et appelle `Preferences.set({ key, value })` ;
- `lire` appelle `Preferences.get({ key })`, qui renvoie `{ value: string | null }`.
  Si rien n'est enregistré, renvoyez `defaut`. Sinon, `JSON.parse` le texte
  **dans une variable de type `unknown`**, et ne le renvoyez que si `valide(...)` l'accepte.
  En cas de JSON illisible (`try/catch`) ou de donnée invalide : `defaut`.

Pourquoi le paramètre `valide` ? Parce que `JSON.parse` renvoie `any` : sans
vérification, une donnée corrompue entrerait dans l'application **en se faisant passer pour un panier**.

## 3. Le panier persistant

Dans `usePanier.ts` :

1. écrivez la garde de type `estPanier(x: unknown): x is LignePanier[]`
   (un tableau dont chaque élément a une `quantite` numérique et un `plat` avec un `id` numérique et un `prix` texte) ;
2. exportez une fonction `restaurerPanier(): Promise<void>` qui lit le panier
   enregistré, puis surveille les changements avec `watch(lignes, ..., { deep: true })`
   pour les enregistrer à chaque modification ;
3. dans `main.ts`, attendez la restauration avant d'afficher l'application :

```ts
Promise.all([router.isReady(), restaurerPanier()]).then(() => {
  app.mount('#app');
});
```

**Vérifiez** : remplissez le panier, rechargez la page (F5). Le panier et le badge sont toujours là.

**Testez la garde** : dans la console du navigateur, tapez
`localStorage.setItem('CapacitorStorage.panier', '"n\'importe quoi"')`, puis rechargez.
L'application doit démarrer avec un panier vide, sans planter.

## 4. Les favoris
Créez `src/composables/useFavoris.ts` sur le même modèle :

- l'état : `ref<number[]>([])`, les identifiants des plats favoris ;
- `restaurerFavoris(): Promise<void>` (à ajouter au `Promise.all` de `main.ts`) ;
- `estFavori(platId: number): boolean` ;
- `basculer(platId: number): Promise<void>` : ajoute ou retire, puis enregistre.

Dans `MenuPage.vue` :

- un bouton cœur sur chaque plat (`heart` / `heartOutline`, couleur `danger`);
- un bouton « Favoris » dans le `ion-segment`, qui n'affiche que les favoris.
  Attention : `charger()` ne doit pas envoyer `'favoris'` comme identifiant de catégorie à l'API.

Écrivez d'abord les signatures, lancez `npm run typecheck`, **puis** le corps des fonctions.
Le compilateur vous dira ce qui manque.

## 5. Bonus — Photographier son plat

```bash
npm install @capacitor/camera@8.2.5 @ionic/pwa-elements@3.4.0
```

Dans `main.ts`, pour que la caméra fonctionne dans le navigateur :

```ts
import { defineCustomElements } from '@ionic/pwa-elements/loader';
defineCustomElements(window);
```

Dans `PlatDetailPage.vue`, un bouton « Photographier mon plat » :

```ts
import { Camera } from '@capacitor/camera';

const photo = ref<string | undefined>(undefined);

async function prendrePhoto() {
  try {
    const resultat = await Camera.takePhoto({ quality: 60, targetWidth: 800 });
    photo.value = resultat.webPath;
  } catch {
    // l'utilisateur a annulé
  }
}
```

Affichez la photo en haut de la carte : `<img v-if="photo" :src="photo" alt="Photo du plat" />`.

Survolez `resultat` dans VS Code et explorez son type : quels champs sont facultatifs ?
Vous découvrez l'API du plugin **sans ouvrir sa documentation**.

## 6. Bonus — Sur un vrai téléphone Android

Il faut Android Studio installé.

```bash
npm run build            # vérifie les types puis produit dist/
npx cap add android      # une seule fois : crée le projet Android
npx cap sync             # copie dist/ et les plugins dans le projet Android
npx cap open android     # ouvre Android Studio : lancez sur un émulateur ou un téléphone
```

Sur le téléphone, `localhost` désigne le téléphone lui-même, pas votre PC : dans `.env`,
mettez l'adresse IP du PC (`VITE_API_URL=http://192.168.x.x:3000/api`), puis refaites
`npm run build` et `npx cap sync`.

## Questions

- **Q8.1** En écrivant `useFavoris.ts`, à quel moment le compilateur vous a-t-il aidé ? Citez une erreur précise qu'il a signalée avant même que vous lanciez l'application.
- **Q8.2** Que se passe-t-il si on retire la garde `estPanier` et qu'on écrit `return JSON.parse(value) as LignePanier[]` ? Le compilateur proteste-t-il ? L'application, avec la donnée corrompue de l'étape 3 ? Que faut-il en conclure sur le mot `as` ?
- **Q8.3** Bilan : citez deux situations du TP où TypeScript vous a fait gagner du temps, et une où il vous en a fait perdre.
