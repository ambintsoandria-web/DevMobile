<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/menu" text="Menu" />
        </ion-buttons>
        <ion-title>{{ plat ? plat.nom : 'Plat' }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div v-if="!plat && !erreur" class="ion-text-center"><ion-spinner /></div>
      <ion-text v-if="erreur" color="danger">
        <p>{{ erreur }}</p>
      </ion-text>
      <img v-if="photo" :src="photo" alt="Photo du plat" />

      <ion-card v-if="plat">
        <ion-card-header>
          <ion-card-subtitle>{{ plat.categorie?.nom }}</ion-card-subtitle>
          <ion-card-title>{{ plat.nom }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <p>{{ plat.description }}</p>
          <p v-if="riz">Avec du riz : {{ formatAriary(Number(plat.prix) + Number(riz.prix)) }}</p>
          <h2 class="prix">{{ formatAriary(plat.prix) }}</h2>
          <ion-badge v-if="!plat.disponible" color="medium">Épuisé</ion-badge>
          <!-- Bouton photo -->
        <ion-button v-if="plat" expand="block" :disabled="!plat.disponible" @click="prendrePhoto">
          <ion-icon slot="start" :icon="phonePortrait" />
           Photographier mon plat
          </ion-button>
          <!-- Bouton photo -->
        </ion-card-content>
      </ion-card>

      <ion-button v-if="plat" expand="block" :disabled="!plat.disponible" @click="ajouterEtRevenir">
        <ion-icon slot="start" :icon="cartOutline" />
        Ajouter au panier
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonBadge,
  IonButton, IonIcon, IonSpinner, IonText, useIonRouter, 
} from '@ionic/vue';
import { cartOutline,phonePortrait } from 'ionicons/icons';
import api, { ErreurApi } from '../services/api';
import type { Plat } from '../types/gargote';
import { formatAriary } from '../utils/format';
import { usePanier } from '../composables/usePanier';
// Camera
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
// 

const route = useRoute();
const ionRouter = useIonRouter();
const { ajouter } = usePanier();

const plat = ref<Plat | null>(null);
const erreur = ref<string | null>(null);
const riz = ref<Plat | null>(null);

onMounted(async () => {
  try {
    plat.value = await api.getPlat(String(route.params.id));
    riz.value = await api.getPlat(7);
  } catch (e) {
    erreur.value = e instanceof ErreurApi && e.statut === 404 ? "Ce plat n'existe pas." : "Impossible de charger le plat.";
  }
});

function ajouterEtRevenir() {
  if (!plat.value) return;
  ajouter(plat.value);
  ionRouter.back(); // retour au menu, avec l'animation de retour
}
</script>

<style scoped>
.prix {
  margin-top: 12px;
  font-weight: 700;
  color: var(--ion-color-primary);
}
</style>
