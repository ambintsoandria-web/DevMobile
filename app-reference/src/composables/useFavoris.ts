import { ref } from 'vue';
import { lire, ecrire } from '../services/stockage';

// 1. l'état : ref<number[]>([])
const favoris = ref<number[]>([]);

// 2. restaurerFavoris(): Promise<void>
export async function restaurerFavoris(): Promise<void> {
    favoris.value = await lire(
        'favoris',
        [],
        (x: unknown): x is number[] => Array.isArray(x) && x.every((id) => typeof id === 'number')
    );
}

export function useFavoris() {
    // 3. estFavori(platId: number): boolean
    function estFavori(platId: number): boolean {
        return favoris.value.includes(platId);
    }

    // 4. basculer(platId: number): Promise<void>
    async function basculer(platId: number): Promise<void> {
        if (estFavori(platId)) {
            favoris.value = favoris.value.filter((id) => id !== platId);
        } else {
            favoris.value.push(platId);
        }
        await ecrire('favoris', favoris.value);
    }

    return { favoris, estFavori, basculer };
}
