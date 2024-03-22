<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from "vue-router";

const router = useRouter();
const products = ref([]);
const loading = ref(false);
const error = ref(false);
const errorMessage = ref('');

async function fetchProducts() {
  loading.value = true;
  error.value = false;
  errorMessage.value = '';

  try {
    const response = await fetch('http://localhost:3000/api/products', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const result = await response.json();
      errorMessage.value = result.error || 'Une erreur est survenue lors du chargement des produits.';
      error.value = true;
    } else {
      products.value = await response.json();
    }
  } catch (e) {
    console.error(e);
    errorMessage.value = 'Une erreur de réseau est survenue.';
    error.value = true;
  } finally {
    loading.value = false;
  }
}

onMounted(fetchProducts);
</script>


<template>
  <div>
    <h1 class="text-center mb-4">Liste des produits</h1>

    <div v-if="loading" class="text-center mt-4">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger mt-4" role="alert">
      Une erreur est survenue lors du chargement des produits.
    </div>

    <div class="row">
      <div class="col-md-4 mb-4" v-for="product in products" :key="product.id">
        <div class="card">
          <RouterLink :to="{ name: 'Product', params: { productId: product.id } }">
            <img :src="product.pictureUrl" class="card-img-top" />
          </RouterLink>
          <div class="card-body">
            <h5 class="card-title">
              <RouterLink :to="{ name: 'Product', params: { productId: product.id } }">
                {{ product.name }}
              </RouterLink>
            </h5>
            <p class="card-text">
              {{ product.description }}
            </p>
            <p class="card-text">
              Vendeur :
              <RouterLink :to="{ name: 'User', params: { userId: product.sellerId } }">
                {{ product.sellerName }}
              </RouterLink>
            </p>
            <p class="card-text">
              En cours jusqu'au {{ product.endDate }}
            </p>
            <p class="card-text">Prix actuel : {{ product.price }} €</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
