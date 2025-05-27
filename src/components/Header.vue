<template>
  <header class="site-header">
    <div class="main_menu">
      <nav class="navbar navbar-expand-lg navbar-light">
        <div class="container">
          <router-link class="navbar-brand site-header-logo" to="/">
            Путевки онлайн
          </router-link>
          <router-link class="btn btn-primary" to="/cart">
            Корзина
            <span class="badge badge-light">{{ totalCount }}</span>
          </router-link>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
import { storeToRefs } from 'pinia'

const cart = useCartStore()
const { totalCount } = storeToRefs(cart)
</script>
