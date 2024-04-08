<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from "../store/auth";

const route = useRoute();
const router = useRouter();
const { token } = useAuthStore();

const productId = ref(route.params.productId);
const product = ref(null);
const loading = ref(false);
const error = ref(null);

function formatDate(date) {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    hour12: false,
  }).format(new Date(date));
}

const deleteProduct = async () => {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
    try {
      const response = await fetch(`http://localhost:3000/api/products/${productId.value}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token.value}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete the product.');
      }

      router.push('/');
    } catch (err) {
      console.error('Error deleting product:', err.message);
      alert('Erreur lors de la suppression du produit.');
    }
  }
};

function isAuthorizedToDelete(bid) {
  return user.value && (user.value.id === bid.bidder.id || user.value.id === product.value.sellerId);
}


const deleteBid = async (bidId) => {
  if (confirm("Êtes-vous sûr de vouloir supprimer cette offre ?")) {
    try {
      const response = await fetch(`http://localhost:3000/api/products/${productId.value}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token.value}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bidId: bidId })
      });

      if (!response.ok) {
        throw new Error('Failed to delete the bid.');
      }

      await fetchProduct();
    } catch (err) {
      console.error('Error deleting bid:', err.message);
      alert('Erreur lors de la suppression de l\'offre.');
    }
  }
};


function canDeleteBid(bid) {
  return user.value && (user.value.id === bid.bidder.id || user.value.id === product.value.sellerId);
}


onMounted(async () => {
  loading.value = true;
  try {
    const response = await fetch(`http://localhost:3000/api/products/${productId.value}`, {
      headers: token.value ? { 'Authorization': `Bearer ${token.value}` } : {},
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch product details');
      } catch (jsonParseError) {
        throw new Error(`Request failed with status ${response.status}`);
      }
    }

    const contentType = response.headers.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Response is not JSON');
    }

    product.value = await response.json();
  } catch (err) {
    error.value = err.message;
    console.error(err);
  } finally {
    loading.value = false;
  }
});

</script>


<template>
  <div class="container mt-4">
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <div v-if="product" class="row">
      <div class="col-lg-4">
        <img :src="product.pictureUrl" alt="Image du produit" class="img-fluid rounded mb-3"/>
        <div class="card">
          <div class="card-header">Fin de l'enchère</div>
          <div class="card-body">
            <p class="card-text">{{ formatDate(product.endDate) }}</p>
          </div>
        </div>
      </div>

      <div class="col-lg-8">
        <h1 class="mb-3">{{ product.name }}</h1>
        <RouterLink :to="{ name: 'ProductEdition', params: { productId: product.id } }" class="btn btn-primary me-2">Editer</RouterLink>
        <button @click="deleteProduct" class="btn btn-danger">Supprimer</button>

        <h2 class="mt-4">Description</h2>
        <p>{{ product.description }}</p>

        <h2 class="mt-4">Informations sur l'enchère</h2>
        <ul>
          <li>Prix de départ : {{ product.originalPrice }} €</li>
          <li>Date de fin : {{ formatDate(product.endDate) }}</li>
          <li>Vendeur : <RouterLink :to="{ name: 'User', params: { userId: product.sellerId } }">{{ product.sellerName }}</RouterLink></li>
        </ul>

         <!-- Section d'enchères -->
         <h2 class="mt-4">Offres sur le produit</h2>
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">Enchérisseur</th>
              <th scope="col">Offre</th>
              <th scope="col">Date</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="product.bids.length === 0">
              <td colspan="4">Aucune offre pour le moment</td>
            </tr>
            <tr v-for="bid in product.bids" :key="bid.id">
              <td>{{ bid.bidder.username }}</td>
              <td>{{ bid.price }} €</td>
              <td>{{ formatDate(bid.date) }}</td>
              <td>
                <button @click="deleteBid(bid.id)" class="btn btn-danger btn-sm">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>