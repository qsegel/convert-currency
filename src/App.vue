<script setup>
import { useCurrency } from '@/composables/useCurrency'
import AppHeader from './components/AppHeader.vue'
import { RouterView } from 'vue-router'

const {
  currencies,
  selectedCurrency,
  activeCurrencies,
  changeCurrency,
  data,
} = useCurrency()
</script>

<template>
  <AppHeader :currencies="currencies" @change="changeCurrency"/>

  <main class="container">
    <RouterView :currencies="currencies" :data="data" :active-currencies="activeCurrencies" :selected-currency="selectedCurrency"/>
  </main>
</template>

<style scoped>
  main {
    margin-top: 2rem;
  }
</style>