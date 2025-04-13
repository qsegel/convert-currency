import { ref, computed, onMounted } from 'vue'

const API_URL = 'https://status.neuralgeneration.com/api/currency'

export function useCurrency() {
  const selectedCurrency = ref('USD')
  const currencyData = ref(null)

  const currencies = ref([
    { name: 'USD', id: 0, pairs: { RUB: null, EUR: null } },
    { name: 'EUR', id: 1, pairs: { RUB: null, USD: null } },
    { name: 'RUB', id: 2, pairs: { USD: null, EUR: null } }
  ])

  const activeCurrencies = computed(() =>
    currencies.value.filter(item => item.name !== selectedCurrency.value)
  )

  const updatePairs = (data) => {
    currencyData.value = data
    currencies.value = currencies.value.map(currency => ({
      ...currency,
      pairs: Object.keys(currency.pairs).reduce((acc, pair) => {
        const pairKey = `${currency.name}-${pair}`.toLowerCase()
        return {
          ...acc,
          [pair]: data?.[pairKey] ?? null
        }
      }, {})
    }))
  }

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL)

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }

      const data = await response.json()
      updatePairs(data)

    } catch (err) {
      console.error('Currency fetch error:', err)
    }
  }

  const changeCurrency = (currency) => {
    selectedCurrency.value = currency
  }

  onMounted(() => {
    fetchData()
  })

  return {
    currencies,
    selectedCurrency: computed(() => selectedCurrency.value),
    activeCurrencies,
    data: computed(() => currencyData.value),
    changeCurrency,
    refresh: fetchData,
  }
}