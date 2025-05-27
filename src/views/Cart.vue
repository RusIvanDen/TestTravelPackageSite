<template>
  <section class="site-main mb-5">
    <div class="container">
      <table class="table">
        <thead>
        <tr>
          <th>№</th>
          <th>Путевка</th>
          <th>Стоимость</th>
          <th>Кол-во</th>
          <th>Сумма</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in cartItems" :key="item.itemId">
          <th scope="row">{{ index + 1 }}</th>
          <td>{{ item.name }}</td>
          <td>{{ item.price.toLocaleString() }} руб</td>
          <td>
            <input
              type="number"
              class="form-control cart-number"
              v-model.number="item.count"
              min="1"
              @change="updateCount(item.itemId, item.count)"
            />
          </td>
          <td>{{ (item.price * item.count).toLocaleString() }} руб</td>
          <td>
            <button
              type="button"
              class="btn btn-danger"
              @click="removeItem(item.itemId)"
            >
              Удалить
            </button>
          </td>
        </tr>
        <tr v-if="cartItems.length > 0">
          <th colspan="3"></th>
          <td><b>Итого:</b></td>
          <td>{{ totalPrice.toLocaleString() }} руб</td>
          <td></td>
        </tr>
        <tr v-if="cartItems.length === 0">
          <td colspan="6" class="text-center">Корзина пуста.</td>
        </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import db from '@/assets/data/db.json'

const cart = useCartStore()

const cartItems = computed(() =>
  cart.items.map(i => {
    const product = db.items.find(x => x.id === i.itemId)
    return {
      itemId: i.itemId,
      name: product?.title || '—',
      price: product?.price || 0,
      count: i.count,
    }
  })
)

const totalPrice = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.price * item.count, 0)
)

function removeItem(itemId: string) {
  cart.remove(itemId)
}

function updateCount(itemId: string, count: number) {
  if (count < 1) return
  cart.items = cart.items.map(i =>
    i.itemId === itemId ? { ...i, count } : i
  )
}
</script>
