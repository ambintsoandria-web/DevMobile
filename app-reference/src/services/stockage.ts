import type { Categorie, Commande, NouvelleCommande, Plat } from '@/types/gargote';
import { Preferences } from '@capacitor/preferences';
import { key } from 'ionicons/icons';
import { ErreurApi } from './api';


export async function lire<T>(cle: string, defaut: T, valide: (x: unknown) => x is T): Promise<T> {
    const { value } = await Preferences.get({ key: cle });
    if (value === null) {
        return defaut;
    }
    try {
        const donnees: unknown = JSON.parse(value);
        return valide(donnees) ? donnees : defaut;
    } catch (error) {
        return defaut;
    }
}

export async function ecrire<T>(cle: string, valeur: T): Promise<void> {
    await Preferences.set({
        key: cle,
        value: JSON.stringify(valeur),
    });
}
