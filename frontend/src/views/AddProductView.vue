<script setup>
import { useAuthStore } from "../store/auth";
import { useRouter } from "vue-router";
import { ref } from "vue";

const { isAuthenticated, token } = useAuthStore();
const router = useRouter();

if (!isAuthenticated.value) {
  router.push({ name: "Login" });
}

const productName = ref('');
const productDescription = ref('');
const productCategory = ref('');
const productOriginalPrice = ref(0);
const productPictureUrl = ref('');
const productEndDate = ref('');

const error = ref(null);
const isSubmitting = ref(false); // Variable to track form submission

const handleSubmit = async () => {
  try {
    isSubmitting.value = true; // Set to true when form is submitting
    
    const response = await fetch('http://localhost:3000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}`
      },
      body: JSON.stringify({
        name: productName.value,
        description: productDescription.value,
        category: productCategory.value,
        originalPrice: productOriginalPrice.value,
        pictureUrl: productPictureUrl.value,
        endDate: productEndDate.value
      })
    });

    if (!response.ok) {
      throw new Error('Failed to add product');
    }

    const data = await response.json();
    router.push({ name: "Product", params: { productId: data.productId } });
  } catch (error) {
    console.error('Error adding product:', error.message);
    error.value = 'Une erreur s\'est produite lors de l\'ajout du produit.';
  } finally {
    isSubmitting.value = false; // Reset to false after submission completes
  }
};
</script>

<template>
  <h1 class="text-center">Ajouter un produit</h1>

  <div class="row justify-content-center">
    <div class="col-md-6">
      <form @submit.prevent="handleSubmit">
        <div v-if="error" class="alert alert-danger mt-4" role="alert" data-test-error>
          {{ error }}
        </div>

        <div class="mb-3">
          <label for="product-name" class="form-label"> Nom du produit </label>
          <input
            v-model="productName"
            type="text"
            class="form-control"
            id="product-name"
            required
            data-test-product-name
          />
        </div>

        <div class="mb-3">
          <label for="product-description" class="form-label">
            Description
          </label>
          <textarea
            v-model="productDescription"
            class="form-control"
            id="product-description"
            name="description"
            rows="3"
            required
            data-test-product-description
          ></textarea>
        </div>

        <div class="mb-3">
          <label for="product-category" class="form-label"> Catégorie </label>
          <input
            v-model="productCategory"
            type="text"
            class="form-control"
            id="product-category"
            required
            data-test-product-category
          />
        </div>

        <div class="mb-3">
          <label for="product-original-price" class="form-label">
            Prix de départ
          </label>
          <div class="input-group">
            <input
              v-model.number="productOriginalPrice"
              type="number"
              class="form-control"
              id="product-original-price"
              name="originalPrice"
              step="1"
              min="0"
              required
              data-test-product-price
            />
            <span class="input-group-text">€</span>
          </div>
        </div>

        <div class="mb-3">
          <label for="product-picture-url" class="form-label">
            URL de l'image
          </label>
          <input
            v-model="productPictureUrl"
            type="url"
            class="form-control"
            id="product-picture-url"
            name="pictureUrl"
            required
            data-test-product-picture
          />
        </div>

        <div class="mb-3">
          <label for="product-end-date" class="form-label">
            Date de fin de l'enchère
          </label>
          <input
            v-model="productEndDate"
            type="date"
            class="form-control"
            id="product-end-date"
            name="endDate"
            required
            data-test-product-end-date
          />
        </div>

        <div class="d-grid gap-2">
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="isSubmitting || !productName || !productDescription || !productCategory || !productOriginalPrice || !productPictureUrl || !productEndDate"
            data-test-submit
          >
            Ajouter le produit
            <span
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
</template>

