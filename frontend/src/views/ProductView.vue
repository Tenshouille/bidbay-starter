<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const productId = ref(route.params.productId);
const product = ref(null);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/products/${productId.value}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product details');
    }
    product.value = await response.json();
    loading.value = false;
  } catch (err) {
    console.error(err);
    error.value = 'Une erreur est survenue lors du chargement des détails du produit.';
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <div v-if="loading" class="text-center mt-4" data-test-loading>
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger mt-4" role="alert" data-test-error>
      {{ error }}
    </div>

    <div v-if="product" class="row" data-test-product>
      <!-- Colonne de gauche : image et compte à rebours -->
      <div class="col-lg-4">
        <img
          :src="product.picture"
          alt=""
          class="img-fluid rounded mb-3"
          data-test-product-picture
        />
        <div class="card">
          <div class="card-header">
            <h5 class="card-title">Compte à rebours</h5>
          </div>
          <div class="card-body">
            <h6 class="card-subtitle mb-2 text-muted" data-test-countdown>
              Temps restant : {{ countdown }}
            </h6>
          </div>
        </div>
      </div>

      <!-- Colonne de droite : informations du produit et formulaire d'enchère -->
      <div class="col-lg-8">
        <div class="row">
          <div class="col-lg-6">
            <h1 class="mb-3" data-test-product-name>{{ product.name }}</h1>
          </div>
          <div class="col-lg-6 text-end">
            <router-link
              :to="{ name: 'ProductEdition', params: { productId: product.id } }"
              class="btn btn-primary"
              data-test-edit-product
            >
              Editer
            </router-link>
            &nbsp;
            <button class="btn btn-danger" data-test-delete-product>
              Supprimer
            </button>
          </div>
        </div>

        <h2 class="mb-3">Description</h2>
        <p data-test-product-description>{{ product.description }}</p>

        <h2 class="mb-3">Informations sur l'enchère</h2>
        <ul>
          <li data-test-product-price>Prix de départ : {{ product.price }} €</li>
          <li data-test-product-end-date>Date de fin : {{ formatDate(product.endDate) }}</li>
          <li>
            Vendeur :
            <router-link
              :to="{ name: 'User', params: { userId: product.sellerId } }"
              data-test-product-seller
            >
              {{ product.seller }}
            </router-link>
          </li>
        </ul>
        
        <!-- Et ainsi de suite pour les autres détails du produit -->

      </div>
    </div>
  </div>
</template>

