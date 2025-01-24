<script setup>
import { computed, ref } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import { ElMessage } from 'element-plus'

const cartStore = useCartStore()

const cartList = computed(() => cartStore.cartList)
const totalCount = computed(() => cartStore.totalCount)
const totalPrice = computed(() => cartStore.totalPrice)

// New code for selection functionality
const selectedItems = ref([])

const isAllSelected = computed(() => {
  return cartList.value.length > 0 && selectedItems.value.length === cartList.value.length
})

const selectedCount = computed(() => {
  return selectedItems.value.reduce((total, item) => total + item.count, 0)
})

const selectedPrice = computed(() => {
  return selectedItems.value.reduce((total, item) => total + item.price * item.count, 0)
})

const toggleItemSelection = (item) => {
  const index = selectedItems.value.findIndex(selectedItem => selectedItem.id === item.id)
  if (index === -1) {
    selectedItems.value.push(item)
  } else {
    selectedItems.value.splice(index, 1)
  }
}

const toggleAllSelection = () => {
  if (isAllSelected.value) {
    selectedItems.value = []
  } else {
    selectedItems.value = [...cartList.value]
  }
}

// Existing code
const removeItem = (id) => {
  const index = cartList.value.findIndex(item => item.id === id)
  if (index !== -1) {
    const removedItem = cartList.value[index]
    cartStore.deleteCart(id)
    // Manually update the total count and price
    totalCount.value -= removedItem.count
    totalPrice.value -= removedItem.price * removedItem.count
    // Remove from selected items if present
    const selectedIndex = selectedItems.value.findIndex(item => item.id === id)
    if (selectedIndex !== -1) {
      selectedItems.value.splice(selectedIndex, 1)
    }
    ElMessage.success('商品已成功移除')
  }
}

const updateCount = (id, count) => {
  const item = cartList.value.find(item => item.id === id)
  if (item) {
    const oldCount = item.count
    item.count = count
    // Manually update the total count and price
    totalCount.value += count - oldCount
    totalPrice.value += item.price * (count - oldCount)
    // Update selected items if present
    const selectedItem = selectedItems.value.find(selectedItem => selectedItem.id === id)
    if (selectedItem) {
      selectedItem.count = count
    }
  }
}
</script>

<template>
  <div class="xtx-cart-page">
    <div class="container m-top-20">
      <div class="cart">
        <table>
          <thead>
            <tr>
              <th width="120">
                <el-checkbox :model-value="isAllSelected" @change="toggleAllSelection" />
              </th>
              <th width="400">商品信息</th>
              <th width="220">单价</th>
              <th width="180">数量</th>
              <th width="180">小计</th>
              <th width="140">操作</th>
            </tr>
          </thead>
          <!-- 商品列表 -->
          <tbody>
            <tr v-for="item in cartList" :key="item.id">
              <td>
                <el-checkbox 
                  :model-value="selectedItems.some(selectedItem => selectedItem.id === item.id)"
                  @change="() => toggleItemSelection(item)"
                />
              </td>
              <td>
                <div class="goods">
                  <RouterLink to="/"><img :src="item.image" alt="" /></RouterLink>
                  <div>
                    <p class="name ellipsis">
                      {{ item.name }}
                    </p>
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen;{{ Number(item.price).toFixed(2) }}</p>
              </td>
              <td class="tc">
                <el-input-number v-model="item.count" @change="(value) => updateCount(item.id, value)" :min="1" />
              </td>
              <td class="tc">
                <p class="f16 red">&yen;{{ (Number(item.price) * item.count).toFixed(2) }}</p>
              </td>
              <td class="tc">
                <p>
                  <el-popconfirm title="确认删除吗?" confirm-button-text="确认" cancel-button-text="取消" @confirm="removeItem(item.id)">
                    <template #reference>
                      <a href="javascript:;">删除</a>
                    </template>
                  </el-popconfirm>
                </p>
              </td>
            </tr>
            <tr v-if="cartList.length === 0">
              <td colspan="6">
                <div class="cart-none">
                  <el-empty description="购物车列表为空">
                    <el-button type="primary" @click="$router.push('/')">随便逛逛</el-button>
                  </el-empty>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 操作栏 -->
      <div class="action">
        <div class="batch">
          共 {{ totalCount }} 件商品，已选择 {{ selectedCount }} 件，商品合计：
          <span class="red">¥ {{ Number(selectedPrice).toFixed(2) }} </span>
        </div>
        <div class="total">
          <el-button size="large" type="primary">下单结算</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.xtx-cart-page {
  margin-top: 20px;

  .cart {
    background: #fff;
    color: #666;

    table {
      border-spacing: 0;
      border-collapse: collapse;
      line-height: 24px;

      th,
      td {
        padding: 10px;
        border-bottom: 1px solid #f5f5f5;

        &:first-child {
          text-align: left;
          padding-left: 30px;
          color: #999;
        }
      }

      th {
        font-size: 16px;
        font-weight: normal;
        line-height: 50px;
      }
    }
  }

  .cart-none {
    text-align: center;
    padding: 120px 0;
    background: #fff;

    p {
      color: #999;
      padding: 20px 0;
    }
  }

  .tc {
    text-align: center;

    a {
      color: $xtxColor;
    }

    .xtx-numbox {
      margin: 0 auto;
      width: 120px;
    }
  }

  .red {
    color: $priceColor;
  }

  .green {
    color: $xtxColor;
  }

  .f16 {
    font-size: 16px;
  }

  .goods {
    display: flex;
    align-items: center;

    img {
      width: 100px;
      height: 100px;
    }

    >div {
      width: 280px;
      font-size: 16px;
      padding-left: 10px;

      .attr {
        font-size: 14px;
        color: #999;
      }
    }
  }

  .action {
    display: flex;
    background: #fff;
    margin-top: 20px;
    height: 80px;
    align-items: center;
    font-size: 16px;
    justify-content: space-between;
    padding: 0 30px;

    .xtx-checkbox {
      color: #999;
    }

    .batch {
      a {
        margin-left: 20px;
      }
    }

    .red {
      font-size: 18px;
      margin-right: 20px;
      font-weight: bold;
    }
  }

  .tit {
    color: #666;
    font-size: 16px;
    font-weight: normal;
    line-height: 50px;
  }
}
</style>

