<script setup>
import { RouterLink } from 'vue-router'
import UiSelect from '@/components/ui/UiSelect.vue'

const emit = defineEmits(['change'])

defineProps({
  currencies: {
    type: Array,
    required: true,
    validator: (value) => value.every(item =>
      item?.id !== undefined &&
      item?.name !== undefined
    )
  }
})

function handleChange(value) {
  emit('change', value)
}
</script>

<template>
  <header class="container">
    <nav>
      <RouterLink to="/">Главная</RouterLink>
      <RouterLink to="/convert">Конвертация</RouterLink>
    </nav>

    <UiSelect
      :options="currencies"
      :modelValue="currencies[0]?.name"
      @update:modelValue="handleChange"
      label="Выбор валюты:"
      class="currency-select"
    />
  </header>
</template>

<style scoped>
  header {
    --header-bg: linear-gradient(135deg, #ff6b6b 0%, #ff4444 100%);
    --text-color: #fff;
    --hover-color: #ffdddd;
    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

    background-image: var(--header-bg);
    color: var(--text-color);
    display: flex;
    padding: 1rem 2rem;
    gap: 2rem;
    align-items: center;
    justify-content: space-between;
    box-shadow: var(--shadow);
    position: relative;
    min-height: 70px;
  }

  nav {
    display: flex;
    gap: 2rem;
    font-weight: 500;
  }

  nav a {
    color: inherit;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    transition: all 0.2s ease;
    position: relative;
  }

  nav a:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  nav a.router-link-exact-active {
    background: rgba(255, 255, 255, 0.2);
  }

  .currency-select {
    width: auto;
  }

  @media (max-width: 768px) {
    header {
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
      text-align: center;
    }

    nav {
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
    }
  }
</style>