<script setup>
  defineProps({
    modelValue: {
      type: String,
      required: true
    },
    options: {
      type: Array,
      required: true,
      validator: (value) => value.every(item =>
        item?.id !== undefined &&
        item?.name !== undefined
      )
    },
    label: {
      type: String,
      default: ''
    },
  })

  defineEmits(['update:modelValue'])
</script>

<template>
  <div class="select-wrapper">
    <label v-if="label" for="select" class="select-label">
      {{ label }}
    </label>

    <select
      id="select"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      class="base-select"
    >
      <option
        v-for="{id, name} in options"
        :key="id"
        :value="name"
      >
        {{ name }}
      </option>

      <option v-if="options.length === 0" disabled>
        Нет доступных вариантов
      </option>
    </select>
  </div>
</template>

<style scoped>
  .select-wrapper {
    position: relative;
    min-width: 150px;
    width: 100%;
    display: flex;
    align-items: center;
    gap: .6rem;
  }

  .select-label {
    display: block;
    font-weight: 500;
    color: var(--text-color);
    flex-shrink: 0;
  }

  .base-select {
    appearance: none;
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.3);
    color: inherit;
    padding: 0.6rem 2rem 0.6rem 1rem;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
  }

  .base-select:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.5);
  }

  .base-select:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
  }

  .base-select option {
    background: #ff6b6b;
    color: #fff;
  }

  .select-wrapper::after {
    content: "▼";
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.8rem;
    pointer-events: none;
  }
</style>