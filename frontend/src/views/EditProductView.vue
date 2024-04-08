<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';

const { isAuthenticated, token } = useAuthStore();
const router = useRouter();
const route = useRoute();

const productId = route.params.productId;

const productName = ref('');
const productDescription = ref('');
const productCategory = ref('');
const productOriginalPrice = ref(0);
const productPictureUrl = ref('');
const productEndDate = ref('');
const error = ref('');

if (!isAuthenticated.value) {
  router.push({ name: 'Login' });
}

onMounted(async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
      headers: {
        'Authorization': `Bearer ${token.value}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch product details');
    }
    const product = await response.json();
    productName.value = product.name;
    productDescription.value = product.description;
    productCategory.value = product.category;
    productOriginalPrice.value = product.originalPrice;
    productPictureUrl.value = product.pictureUrl;
    productEndDate.value = product.endDate.split('T')[0];
  } catch (err) {
    console.error('Error fetching product details:', err);
    error.value = 'Failed to fetch product details';
  }
});

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}`,
      },
      body: JSON.stringify({
        name: productName.value,
        description: productDescription.value,
        category: productCategory.value,
        originalPrice: productOriginalPrice.value,
        pictureUrl: productPictureUrl.value,
        endDate: productEndDate.value,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to edit product');
    }

    router.push({ name: 'Product', params: { productId } });
  } catch (err) {
    console.error('Error updating product:', err);
    error.value = 'Une erreur s\'est produite lors de la modification du produit.';
  } finally {
    isSubmitting.value = false;
  }
};


const isSubmitting = ref(false);

</script>

<template>
  <div class="container mt-4">
    <h1 class="text-center">Modifier un produit</h1>

    <div class="row justify-content-center">
      <div class="col-md-6">
        <form @submit.prevent="handleSubmit">
          <div v-if="error" class="alert alert-danger" role="alert" data-test-error>{{ error }}</div>
          
          <div class="mb-3">
            <label for="product-name" class="form-label">Nom du produit</label>
            <input v-model="productName" type="text" class="form-control" id="product-name" data-test-product-name required>
          </div>
          
          <div class="mb-3">
            <label for="product-description" class="form-label">Description</label>
            <textarea v-model="productDescription" class="form-control" id="product-description" rows="3" data-test-product-description required></textarea>
          </div>
          
          <div class="mb-3">
            <label for="product-category" class="form-label">Catégorie</label>
            <input v-model="productCategory" type="text" class="form-control" id="product-category" data-test-product-category required>
          </div>
          
          <div class="mb-3">
            <label for="product-original-price" class="form-label">Prix de départ</label>
            <input v-model.number="productOriginalPrice" type="number" class="form-control" id="product-original-price" data-test-product-price required>
          </div>
          
          <div class="mb-3">
            <label for="product-picture-url" class="form-label">URL de l'image</label>
            <input v-model="productPictureUrl" type="url" class="form-control" id="product-picture-url" data-test-product-picture required>
          </div>
          
          <div class="mb-3">
            <label for="product-end-date" class="form-label">Date de fin de l'enchère</label>
            <input v-model="productEndDate" type="date" class="form-control" id="product-end-date" data-test-product-end-date required>
          </div>
          
          <div class="d-grid gap-2">
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting" data-test-submit>Soumettre les modifications
              <span
              v-if="isSubmitting"
              data-test-spinner
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
