<script setup>
  import { computed } from 'vue';

  const { activeCurrencies, selectedCurrency } = defineProps({
    activeCurrencies: {
      type: Array,
      required: true,
      validator: (value) => value.every(item =>
        item?.id !== undefined &&
        item?.name !== undefined &&
        item?.pairs !== undefined
      )
    },

    selectedCurrency: {
      type: String,
      required: true
    }
  });

  const formatRate = (value) => {
    if (!value) return '—';
    return value.toFixed(2).replace('.', ',');
  }

  const ratesList = computed(() =>
    activeCurrencies.map(item => ({
      ...item,
      rate: item.pairs[selectedCurrency]
    }))
  );
</script>

<template>
  <section class="home">
    <div v-if="activeCurrencies.length === 0" class="empty-state">
      Нет доступных валют для сравнения
    </div>

    <div v-else v-for="item in ratesList" :key="item.id">
      1 {{ item.name }} = {{ formatRate(item.rate) }} {{ selectedCurrency }}
    </div>
  </section>
</template>

<style scoped>
  .home {
    --gap-size: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: var(--gap-size);
    padding: 1rem;
  }

  .home > div {
    background: #f5f5f5;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    width: max-content;
  }

  .empty-state {
    text-align: center;
    color: #666;
    padding: 2rem;
  }
</style>