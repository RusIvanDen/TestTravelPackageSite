<template>
  <section class="site-main mb-5">
    <div class="container">
      <div class="row">
        <div class="col-xl-3 col-lg-4 col-md-5">
          <div class="filter-sidebar">
            <div class="filter-sidebar-header">Страны:</div>
            <div class="filter-sidebar-content">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  id="country-all"
                  name="country"
                  value=""
                  v-model="selectedCountryId"
                />
                <label class="form-check-label" for="country-all">
                  Все ({{ items.length }})
                </label>
              </div>
              <div
                class="form-check"
                v-for="(country, index) in countries"
                :key="index"
              >
                <input
                  class="form-check-input"
                  type="radio"
                  :id="'country-' + index"
                  name="country"
                  :value="country.id"
                  v-model="selectedCountryId"
                />
                <label class="form-check-label" :for="'country-' + index">
                  {{ country.title }} ({{ getCountByCountry(country.id) }})
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-9 col-lg-8 col-md-7">
          <div class="filter-bar mb-3">
            <div class="input-group">
              <input
                type="text"
                class="form-control"
                placeholder="Название города"
                v-model="searchQuery"
              />
              <div class="input-group-append">
                <button
                  class="btn btn-outline-secondary"
                  type="button"
                  @click="performSearch"
                >
                  Искать
                </button>
              </div>
            </div>
          </div>

          <div class="card-grid">
            <div
              class="card text-center card-product"
              v-for="item in filteredItems"
              :key="item.id"
            >
              <div class="card-product__img">
                <img class="card-img" :src="item.image" alt="" />
              </div>
              <div class="card-body">
                  <p>{{ getCountryTitle(item.countryId) }}</p>
                  <h4 class="card-product__title">{{ item.title }}</h4>
                  <p class="card-product__price">{{ item.price }} руб</p>
                <router-link
                  :to="`/item/${item.id}`"
                  class="btn"
                  :class="cart.isInCart(item.id) ? 'btn-danger' : 'btn-primary'"
                >
                    {{ cart.isInCart(item.id) ? 'Отмена' : 'Заказать' }}
                </router-link>
              </div>
            </div>

            <div v-if="filteredItems.length === 0" class="text-center mt-4">
              <p>Ничего не найдено.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import data from '@/assets/data/db.json'
import { useCartStore } from '@/stores/cart'

const countries = ref([])
const items = ref([])
const selectedCountryId = ref('')
const searchQuery = ref('')
const actualQuery = ref('')
const cart = useCartStore()

onMounted(() => {
  countries.value = data.countries
  items.value = data.items
})

function getCountByCountry(countryId: string) {
  return items.value.filter(item => item.countryId === countryId).length
}

function performSearch() {
  actualQuery.value = searchQuery.value.trim()
}

function getCountryTitle(countryId: string) {
    const country = countries.value.find(c => c.id === countryId)
    return country ? country.title : ''
}

const filteredItems = computed(() => {
  let result = items.value
  if (selectedCountryId.value) {
    result = result.filter(item => item.countryId === selectedCountryId.value)
  }
  if (actualQuery.value !== '') {
    const query = actualQuery.value.toLowerCase()
    result = result.filter(item => item.title.toLowerCase().includes(query))
  }
  return result
})
</script>
