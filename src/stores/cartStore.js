import { defineStore } from "pinia"
import { ref, computed } from "vue"

export const useCartStore = defineStore("cart", () => {
  const cartList = ref([])

  const totalCount = computed(() => {
    return cartList.value.reduce((acc, item) => acc + item.count, 0)
  })

  const totalPrice = computed(() => {
    return cartList.value.reduce((acc, item) => acc + item.count * item.price, 0)
  })

  const addToCart = (item) => {
    const existingItem = cartList.value.find((i) => i.skuId === item.skuId)
    if (existingItem) {
      existingItem.count++
    } else {
      cartList.value.push({ ...item, count: 1 })
    }
  }

  const deleteCart = (skuId) => {
    const index = cartList.value.findIndex((item) => item.skuId === skuId)
    if (index !== -1) {
      cartList.value.splice(index, 1)
    }
  }

  return {
    cartList,
    totalCount,
    totalPrice,
    addToCart,
    deleteCart,
  }
})