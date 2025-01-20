<script setup>
import { ref } from 'vue'

const isOpen = ref(false)

const toggleCart = () => {
  isOpen.value = !isOpen.value
}

// 模拟购物车数据
const cartItems = ref([
  {
    id: 1,
    name: "高品质无线蓝牙耳机",
    picture: "https://picsum.photos/id/1/200/200",
    price: 299,
    count: 1,
    attrsText: "白色"
  },
  {
    id: 2,
    name: "时尚休闲运动鞋",
    picture: "https://picsum.photos/id/21/200/200",
    price: 199,
    count: 2,
    attrsText: "黑色, 42码"
  },
  {
    id: 3,
    name: "多功能智能手表",
    picture: "https://picsum.photos/id/26/200/200",
    price: 599,
    count: 1,
    attrsText: "银色"
  }
])

const totalCount = ref(4)
const totalPrice = ref(1096)

const removeItem = (id) => {
  const index = cartItems.value.findIndex(item => item.id === id)
  if (index !== -1) {
    cartItems.value.splice(index, 1)
    // 在实际应用中，这里应该重新计算总数和总价
    totalCount.value -= 1
    totalPrice.value -= cartItems.value[index].price * cartItems.value[index].count
  }
}

defineExpose({
  toggleCart
})
</script>

<template>
  <div class="sliding-cart">
    <Transition name="slide">
      <div v-if="isOpen" class="cart-panel">
        <div class="header">
          <h3>购物车</h3>
          <button class="close-btn" @click="toggleCart">
            <i class="iconfont icon-close-new"></i>
          </button>
        </div>
        <div class="list">
          <div class="item" v-for="item in cartItems" :key="item.id">
            <RouterLink to="">
              <img :src="item.picture" alt="" />
              <div class="center">
                <p class="name ellipsis-2">
                  {{ item.name }}
                </p>
                <p class="attr ellipsis">{{ item.attrsText }}</p>
              </div>
              <div class="right">
                <p class="price">&yen;{{ item.price.toFixed(2) }}</p>
                <p class="count">x{{ item.count }}</p>
              </div>
            </RouterLink>
            <i class="iconfont icon-close-new" @click="removeItem(item.id)"></i>
          </div>
        </div>
        <div class="foot">
          <div class="total">
            <p>共 {{ totalCount }} 件商品</p>
            <p>&yen; {{ totalPrice.toFixed(2) }} </p>
          </div>
          <el-button size="large" type="primary" @click="$router.push('/cartlist')">去购物车结算</el-button>
        </div>
      </div>
    </Transition>
    <div v-if="isOpen" class="overlay" @click="toggleCart"></div>
  </div>
</template>

<style scoped lang="scss">
.sliding-cart {
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 998;
  }

  .cart-panel {
    position: fixed;
    top: 0;
    right: 0;
    width: 400px;
    height: 100vh;
    background: #fff;
    z-index: 999;
    display: flex;
    flex-direction: column;

    .header {
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #f5f5f5;

      h3 {
        font-size: 18px;
        font-weight: normal;
      }

      .close-btn {
        border: none;
        background: none;
        cursor: pointer;
        font-size: 22px;
        color: #999;

        &:hover {
          color: $xtxColor;
        }
      }
    }

    .list {
      flex: 1;
      overflow: auto;
      padding: 0 20px;

      &::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }

      &::-webkit-scrollbar-track {
        background: #f8f8f8;
        border-radius: 2px;
      }

      &::-webkit-scrollbar-thumb {
        background: #eee;
        border-radius: 10px;
      }

      &::-webkit-scrollbar-thumb:hover {
        background: #ccc;
      }

      .item {
        border-bottom: 1px solid #f5f5f5;
        padding: 10px 0;
        position: relative;

        i {
          position: absolute;
          bottom: 38px;
          right: 0;
          opacity: 0;
          color: #666;
          transition: all 0.5s;
        }

        &:hover {
          i {
            opacity: 1;
            cursor: pointer;
          }
        }

        a {
          display: flex;
          align-items: center;

          img {
            height: 80px;
            width: 80px;
            object-fit: cover;
          }

          .center {
            padding: 0 10px;
            width: 200px;

            .name {
              font-size: 16px;
            }

            .attr {
              color: #999;
              padding-top: 5px;
            }
          }

          .right {
            width: 100px;
            padding-right: 20px;
            text-align: center;

            .price {
              font-size: 16px;
              color: $priceColor;
            }

            .count {
              color: #999;
              margin-top: 5px;
              font-size: 16px;
            }
          }
        }
      }
    }

    .foot {
      padding: 20px;
      border-top: 1px solid #f5f5f5;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .total {
        padding-left: 10px;
        color: #999;

        p {
          &:last-child {
            font-size: 18px;
            color: $priceColor;
          }
        }
      }
    }
  }
}

// Slide animation
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease-out;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(100%);
}
</style>

