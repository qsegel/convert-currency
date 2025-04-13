<script setup>
import UiSelect from '@/components/ui/UiSelect.vue'
import { ref, watchEffect } from 'vue';
import { useNumberFormatter } from '@/composables/useNumberFormatter';

const { format } = useNumberFormatter();

const props = defineProps({
  currencies: {
    type: Array,
    required: true,
    validator: (value) => value.every(item =>
      item?.name && item?.id !== undefined
    )
  },
  data: {
    type: [Object, null],
    default: null,
    validator: (value) => {
      return value === null ||
        (typeof value === 'object' && !Array.isArray(value))
    }
  }
});

const valueSelect1 = ref('USD');
const valueSelect2 = ref('EUR');
const valueInput1 = ref('1');
const valueInput2 = ref(0);
const errorMessage = ref('');

const isNumeric = (value) => {
  return /^-?\d*[.,]?\d*$/.test(value);
};

const getRate = () => {
  const key = `${valueSelect1.value.toLowerCase()}-${valueSelect2.value.toLowerCase()}`;
  return props.data?.[key] ?? null;
};

const updateConversion = () => {
  const rate = getRate();
  if (!rate) {
    valueInput2.value = '—';
    return;
  }

  const numericValue = parseFloat(valueInput1.value.replace(',', '.'));
  valueInput2.value = isNaN(numericValue) ? 0 : numericValue * rate;
};

watchEffect(updateConversion);

function handleInput(evt) {
  const inputValue = evt.target.value;

  if (!isNumeric(inputValue)) {
    errorMessage.value = 'Вводите только числа (допустимы точка или запятая для десятичных)';
    return;
  }

  errorMessage.value = '';

  const sanitizedValue = inputValue.replace(',', '.');

  valueInput1.value = sanitizedValue;

  if (sanitizedValue === '.' || sanitizedValue === ',') {
    valueInput1.value = '0.';
  }
}
</script>

<template>
  <section class="convert">
    <div class="row">
      <label class="input-group">
        <UiSelect
          :options="currencies"
          :modelValue="valueSelect1"
          class="currency-select"
          @update:modelValue="(val) => valueSelect1 = val"
        />

        <input
          type="text"
          :value="valueInput1"
          @input="handleInput"
          class="amount-input"
          placeholder="Введите число"
        >
      </label>
    </div>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <div class="row">
      <label class="input-group">
        <UiSelect
          :options="currencies"
          :modelValue="valueSelect2"
          class="currency-select"
          @update:modelValue="(val) => valueSelect2 = val"
        />

        <input
          type="text"
          :value="format(valueInput2)"
          readonly
          class="result-input"
        >
      </label>
    </div>
  </section>
</template>

<style scoped>
.error-message {
  color: #dc3545;
  font-size: 0.9rem;
  margin-top: -1rem;
  margin-bottom: 0.5rem;
}

.amount-input:invalid {
  border-color: #dc3545;
}

.convert {
  display: grid;
  gap: 1.5rem;
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.input-group {
  display: flex;
  gap: 1rem;
  width: 100%;
}

.amount-input {
  flex: 2;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.result-input {
  flex: 2;
  padding: 0.5rem;
  background: #f1f3f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  pointer-events: none;
}

.currency-select {
  flex: 1;
  padding: 0;
  border: none;
  border-radius: 4px;
}

.currency-select::after {
  color: #666;
}

.currency-select :deep(.base-select) {
  border: 1px solid #ddd;
  background: white;
  color: #333;
}

.currency-select :deep(.base-select:hover) {
  background: #f8f9fa;
  border-color: #ccc;
}

.currency-select :deep(.base-select:focus) {
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}

@media (max-width: 480px) {
  .input-group {
    flex-direction: column;
  }
}
</style>