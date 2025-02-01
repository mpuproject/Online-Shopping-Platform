import { useUserStore } from "@/stores/user"
import { useRouter } from 'vue-router';
import { useCartStore } from "@/stores/cartStore"

export const saveCartToServer = async(url) => {
  const userStore = useUserStore()
  const cartStore = useCartStore()
  const router = useRouter()

  // 1.保存购物车数据
  try {
    const data = {
      user: userStore.userInfo.id,
      products: cartStore.cartList
    }
    await cartStore.saveCart(data)
} catch (error) {
  console.error('Failed to save cart:', error)
}
  // 2. 清除本地用户数据和购物车数据
  userStore.clearUserInfo()
  cartStore.clearCart()
  // 3. 跳转登录页
  router.push(url)
}
