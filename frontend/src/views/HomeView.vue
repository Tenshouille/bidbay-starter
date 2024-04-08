<template>
  <div>
    <!-- Votre code existant pour afficher la liste des produits -->
    <h1 class="text-center mb-4">Liste des produits</h1>

    <div class="row mb-3">
      <div class="col-md-6">
        <form>
          <div class="input-group">
            <span class="input-group-text">Filtrage</span>
            <input
              type="text"
              class="form-control"
              placeholder="Filtrer par nom"
              data-test-filter
              v-model="filterText"
              @input="updateFilter"
            />
          </div>
        </form>
      </div>
      <div class="col-md-6 text-end">
        <div class="btn-group">
          <button
            type="button"
            class="btn btn-primary dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            data-test-sorter
          >
            Trier par {{ sortBy === 'name' ? 'nom' : 'prix' }}
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li>
              <a class="dropdown-item" href="#" @click="sortBy = 'name'"> Nom </a>
            </li>
            <li>
              <a class="dropdown-item" href="#" @click="sortBy = 'price'" data-test-sorter-price>
                Prix
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center mt-4">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger mt-4" role="alert">
      {{ errorMessage }}
    </div>

    <div class="row">
      <div class="col-md-4 mb-4" v-for="product in sortedFilteredProducts" :key="product.id">
        <div class="card">
          <!-- Utilisation de RouterLink pour diriger l'utilisateur vers la page des détails du produit -->
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
              En cours jusqu'au {{ formatDate(product.endDate) }}
            </p>
            <p class="card-text">Prix actuel : {{ product.originalPrice }} €</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from "vue-router";

const router = useRouter();
const products = ref([]);
const loading = ref(false);
const error = ref(false);
const errorMessage = ref('');
const filterText = ref('');
const sortBy = ref('name');

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

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Intl.DateTimeFormat('fr-FR', options).format(new Date(dateString));
};

// Méthode pour filtrer les produits par nom
function filterProducts() {
  return products.value.filter(product => {
    return product.name.toLowerCase().includes(filterText.value.toLowerCase());
  });
}


// Méthode pour trier les produits par nom ou prix
function sortProducts() {
  const sortedProducts = [...products.value];
  if (sortBy.value === 'name') {
    sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy.value === 'price') {
    sortedProducts.sort((a, b) => a.originalPrice - b.originalPrice);
  }
  return sortedProducts;
}

// Propriété calculée pour récupérer les produits filtrés et triés
const sortedFilteredProducts = computed(() => {
  const filtered = products.value.filter(product => {
    return product.name.toLowerCase().includes(filterText.value.toLowerCase());
  });

  if (sortBy.value === 'name') {
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy.value === 'price') {
    return filtered.sort((a, b) => a.originalPrice - b.originalPrice);
  }

  return filtered;
});


// Méthode pour mettre à jour le filtre à chaque modification de l'entrée
function updateFilter() {
}

// Appeler fetchProducts() au montage
onMounted(fetchProducts);
</script>
