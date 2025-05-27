<template>
  <section class="site-main mb-5" v-if="item">
    <div class="container">
      <div class="card text-center card-product">
        <div class="card-product__img">
          <img class="card-img" :src="item.image" :alt="item.title" />
        </div>
        <div class="card-body">
          <p>{{ country?.title }}</p>
          <h4 class="card-product__title">{{ item.title }}</h4>
          <p class="card-product__price">{{ item.price.toLocaleString() }} руб</p>
          <p><b>Длительность:</b> {{ item.duration }} дней / {{ item.duration - 1 }} ночей</p>
          <div class="card-product__description" v-html="item.description"></div>
          <button
            type="button"
            class="btn"
            :class="cart.isInCart(item.id) ? 'btn-danger' : 'btn-primary'"
            @click="cart.toggle(item.id)"
          >
            {{ cart.isInCart(item.id) ? 'Отмена' : 'Заказать' }}
          </button>
        </div>
      </div>
    </div>
  </section>
  <div v-else class="text-center py-5">
    <p>Тур не найден</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import db from '@/assets/data/db.json'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const id = route.params.id as string

const item = ref(db.items.find(i => i.id === id) || null)
const country = ref(item.value ? db.countries.find(c => c.id === item.value.countryId) : null)

const cart = useCartStore()
</script>
