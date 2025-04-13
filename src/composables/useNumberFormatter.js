// composables/useNumberFormatter.js
import { ref, computed } from 'vue'

const DEFAULT_OPTIONS = {
  locale: 'ru-RU',
  style: 'decimal',
  currency: 'RUB',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  fallback: '—'
}

export function useNumberFormatter(initialOptions = {}) {
  const options = ref({
    ...DEFAULT_OPTIONS,
    ...initialOptions
  })

  const formatter = computed(
    () => new Intl.NumberFormat(options.value.locale, {
      style: options.value.style,
      currency: options.value.style === 'currency' ? options.value.currency : undefined,
      minimumFractionDigits: options.value.minimumFractionDigits,
      maximumFractionDigits: options.value.maximumFractionDigits
    })
  )

  /**
   * Основная функция форматирования чисел
   * @param {number|string} value - Значение для форматирования
   * @param {Object} overrideOptions - Опции для переопределения
   * @returns {string} Отформатированная строка
   */
  const format = (value, overrideOptions = {}) => {
    if (isNaN(value) || value === null || value === undefined) {
      return options.value.fallback
    }

    const num = typeof value === 'string' ? parseFloat(value) : value
    const currentFormatter = overrideOptions ?
      new Intl.NumberFormat(
        overrideOptions.locale || options.value.locale,
        {
          ...options.value,
          ...overrideOptions
        }
      ) : formatter.value

    return currentFormatter.format(num)
  }

  /**
   * Форматирование валюты с автоматическим определением символа
   */
  const currency = (value, currencyCode = options.value.currency) => {
    return format(value, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  /**
   * Форматирование процентов
   */
  const percentage = (value, decimals = 2) => {
    return format(value * 100, {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })
  }

  /**
   * Упрощенное форматирование больших чисел
   */
  const humanize = (value) => {
    const num = parseFloat(value)
    if (num >= 1e9) return `${format(num / 1e9)}B`
    if (num >= 1e6) return `${format(num / 1e6)}M`
    if (num >= 1e3) return `${format(num / 1e3)}K`
    return format(num)
  }

  /**
   * Обратное преобразование отформатированной строки в число
   */
  const unformat = (formattedString) => {
    const decimalSeparator = Intl.NumberFormat(options.value.locale)
      .format(1.1)
      .replace(/\p{Number}/gu, '')

    const cleaned = formattedString
      .replace(new RegExp(`[^0-9${decimalSeparator}-]`, 'g'), '')
      .replace(decimalSeparator, '.')

    return parseFloat(cleaned)
  }

  /**
   * Округление числа до указанного количества знаков
   */
  const round = (value, decimals = options.value.maximumFractionDigits) => {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals)
  }

  return {
    options,
    format,
    currency,
    percentage,
    humanize,
    unformat,
    round
  }
}