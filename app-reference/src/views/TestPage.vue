<template>
    <ion-page>
        <ion-header>
            <ion-toolbar color="primary">
                <ion-title>Liste de plats</ion-title>
            </ion-toolbar>
            <ion-toolbar>
                <ion-searchbar v-model="recherche" placeholder="Recherche de plats par nom" />
            </ion-toolbar>
            <select name="categorie" v-model="categorieChoisie">
                <option value="Toutes">Toutes</option>
                <option :key="c.id" :value="c.id" v-for="c in categories">
                    {{ c.nom }}
                </option>
            </select>
        </ion-header>

        <ion-content>
            <div v-if="chargement" class="ion-text-center ion-padding">
                <ion-spinner />
            </div>

            <ion-text v-else-if="erreur" color="danger" class="ion-padding">
                <p>{{ erreur }}</p>
            </ion-text>

            <ion-list v-else-if="platsFiltres.length > 0">
                <ion-item v-for="plat in platsFiltres" :key="plat.id" :router-link="`/tabs/menu/${plat.id}`"
                    :detail="false">
                    <ion-label>
                        <h2>{{ plat.nom }}</h2>
                        <p>{{ plat.description }}</p>
                        <p>
                            <ion-text color="primary"><strong>{{ formatAriary(plat.prix) }}</strong></ion-text>
                            <ion-badge v-if="!plat.disponible" color="medium" class="epuise">Épuisé</ion-badge>
                        </p>
                    </ion-label>
                </ion-item>
            </ion-list>

            <!-- Aucun résultat -->
            <div v-else class="ion-text-center ion-padding">
                <p>Aucun plat trouvé.</p>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem,
    IonLabel, IonSpinner, IonText, IonBadge, IonSearchbar,
} from '@ionic/vue';
import api from '../services/api';
import type { Categorie, Plat } from '../types/gargote';
import { formatAriary } from '../utils/format';

const categories = ref<Categorie[]>([]);
const categorieChoisie = ref<number | 'Toutes'>('Toutes');
const plats = ref<Plat[]>([]);
const chargement = ref(true);
const erreur = ref<string | null>(null);
const recherche = ref('');

const platsFiltres = computed(() => {
    const mot = recherche.value.trim().toLowerCase();
    const categorie = categorieChoisie.value;
    return categorie === 'Toutes' ? plats.value.filter((p) => p.nom.toLowerCase().includes(mot))
        : plats.value.filter((p) => p.nom.toLowerCase().includes(mot) && p.categorie?.id === categorieChoisie.value);
});

async function chargerPlat() {
    try {
        plats.value = await api.getPlats(null);
    } catch (error) {
        erreur.value = "Impossible de joindre l'API. Est-elle lancée ?";
        console.error(error);
    } finally {
        chargement.value = false;
    }
}

onMounted(async () => {
    categories.value = await api.getCategories();
    await chargerPlat();
});
</script>
