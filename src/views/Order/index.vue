<!-- src/views/Order/index.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getOrderByUserIdAPI,
  updateOrderAPI,
  updateOrderItemAPI,
} from '@/apis/checkout'
import LayoutHeader  from '@/views/Layout/components/LayoutHeader.vue'
import LayoutStatus from '@/views/Layout/components/LayoutStatus.vue'

const userStore = useUserStore()

// 订单状态映射
const stateMap = {
  '0': 'Unpaid',
  '1': 'Paid',
  '2': 'Cancelled',
}

// 商品状态映射
const itemStateMap = {
  '0': { text: 'Unpaid', type: 'warning' },
  '1': { text: 'Pending', type: 'success' },
  '2': { text: 'Cancelled', type: 'info' },
  '3': { text: 'Shipped', type: 'primary' },
  '4': { text: 'Delivered', type: '' },
  '5': { text: 'Received', type: 'success' },
  '6': { text: 'Refund Pending', type: 'danger' },
  '7': { text: 'Refunded', type: 'info' },
  '8': { text: 'Done', type: 'success' },
  '9': {text: 'Hold', type: 'success'}
}

// 标签页配置
const tabTypes = [
  { name: "all", label: "All Orders" },
  { name: "0", label: "Unpaid" },
  { name: "1", label: "Pending" },
  { name: "2", label: "Cancelled" },
  { name: "9", label: "Hold" },
  { name: "3", label: "Shipped" },
  { name: "4", label: "Delivered" },
  { name: "5", label: "Received" },
  { name: "6", label: "Refund Pending" },
  { name: "7", label: "Refunded" },
  { name: "8", label: "Done" }
]

const orderList = ref([])
const total = ref(0)
const currentPage = ref(1)
const activeTab = ref('all')

// 获取订单数据
const fetchOrders = async () => {
  try {
    const params = {
      userId: userStore.userInfo.id,
      itemStatus: activeTab.value === 'all' ? undefined : activeTab.value.toString(), page: currentPage.value,
      page_size: 2
}

    const { data } = await getOrderByUserIdAPI(params)

    orderList.value = data.results.map(order => ({
      id: order.id,
      createTime: order.created_time || '无记录时间',
      status: order.status,
      skus: order.items.filter(item => activeTab.value === 'all' || item.item_status === activeTab.value).map(item => ({
        id: item.id,
        createdTime: item.created_time,
        updatedTime: item.updated_time,
        image: item.image || '/placeholder.svg',
        status: item.item_status,
        name: item.name,
        attrsText: item.specs ? Object.entries(item.specs)
          .map(([k, v]) => `${k}:${v}`).join(' ') : '无规格',
        realPay: item.price,
        quantity: item.quantity
      })),
      payMoney: order.total_price,
      postFee: order.post_fee || 0
    }))
    total.value = data.count
  } catch (error) {
    ElMessage.error(error)
  }
}


// Tab切换
const tabChange = (type) => {
  activeTab.value = type
  currentPage.value = 1
  fetchOrders()
}

// 分页切换
const pageChange = (page) => {
  currentPage.value = page
  fetchOrders()
}
// 取消订单
const handleCancelOrder = async (orderId) => {
  ElMessageBox.confirm(
    'Are you sure to cancel this order? This operation cannot be undone.',
    'Confirmation',
    {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  ).then( async () => {
    const res = await updateOrderAPI({
      orderStatus: '2',
      orderId: orderId,
    })
    if (res.code === 1) {
      ElMessage.success('Order cancelled successfully')
      await fetchOrders()
    } else {
      ElMessage.error('Error: ' + res.msg)
    }
  })
}

// 确认收货
const handleConfirmReceipt = async (itemId) => {
  try {

    const res = await updateOrderItemAPI({
      itemId: itemId,  //
      itemStatus: '5'   //
    })

    // 添加响应状态判断
    if (res.code === 200) {
      ElMessage.success('Receipt confirmed successfully')
      await fetchOrders()
    } else {
      ElMessage.error(`Operation failed: ${res.message || 'Unknown error'}`)
    }
  } catch (error) {
    // 增强错误信息
    ElMessage.error(`Operation failed: ${error.response?.data?.message || error.message}`)
  }
}

// 退款处理函数
const handleRefund = async (itemId) => {
  try {
    const currentItem = orderList.value
      .flatMap(order => order.skus)
      .find(item => item.id === itemId)

    if (!currentItem) {
      ElMessage.error('未找到对应订单项')
      return
    }

    const isApplying = currentItem.status !== '6'
    const actionName = isApplying ? 'request refund' : 'cancel refund'

    // 添加确认对话框
    await ElMessageBox.confirm(
      `Are you sure to ${actionName}?`,
      'Confirmation',
      {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )

    const targetStatus = isApplying ? '6' : '7'
    const res = await updateOrderItemAPI({
      itemId: itemId,
      itemStatus: targetStatus
    })

    if (res.code === 200) {
      ElMessage.success(`${actionName} successful`)
      await fetchOrders()
    }
  } catch (error) {
    // 捕获用户取消操作的情况
    if (error !== 'cancel') {
      ElMessage.error(`Operation failed: ${error.response?.data?.message || error.message}`)
    }
  }
}
// 初始化获取数据
onMounted(() => {
  fetchOrders()
})

// 添加时间格式化方法
const formatDateTime = (timeString) => {
  if (!timeString) return ''
  const date = new Date(timeString)
  return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')} ${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')}`
// 状态显示格式化
}
</script>

<template>
  <LayoutStatus />
  <LayoutHeader />
  <div class="order-container">
    <el-tabs v-model="activeTab" @tab-change="tabChange">
      <el-tab-pane
        v-for="item in tabTypes"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      />
      <div class="main-container">
        <div class="holder-container" v-if="orderList.length === 0">
          <el-empty description="No orders found" />
        </div>
        <div v-else>
          <!-- 订单列表 -->
          <div
            class="order-item"
            v-for="order in orderList"
            :key="order.id"
          >
            <div class="head">
              <span>Order Time: {{ formatDateTime(order.createTime) }}</span>
              <span>Order ID: {{ order.id }}</span>
              <span class="filter-tip" v-if="activeTab !== 'all'">
                Current filter: {{ tabTypes.find(t => t.name === activeTab)?.label }}
              </span>
            </div>
            <div class="body">
              <div class="column goods">
                <ul>
                  <li v-for="item in order.skus" :key="item.id">
                    <a class="image" href="javascript:;">
                      <img :src="item.image" alt="" />
                    </a>
                    <div class="info">
                      <p class="name ellipsis-2">{{ item.name }}</p>
                      <p class="attr ellipsis">
                        <span>{{ item.attrsText }}</span>
                      </p>
                      <p class="time" v-if="item.updatedTime">
                        Last update time: {{ formatDateTime(item.updatedTime) }}
                      </p>
                      <el-tag
                        :type="itemStateMap[item.status]?.type"
                        size="small"
                        class="status-tag"
                      >
                        {{ itemStateMap[item.status]?.text || 'Unknown status' }}
                      </el-tag>
                    </div>
                    <div class="price">¥{{ (item.realPay || 0).toFixed(2) }}</div>
                    <div class="action">
                      <el-button
                        v-if="item.status === '4'"
                        type="success"
                        size="small"
                        @click="handleConfirmReceipt(item.id)"
                      >
                        Confirm Receipt
                      </el-button>
                      <el-button
                        v-if="['1', '3', '4', '5'].includes(item.status)"
                        type="warning"
                        size="small"
                        @click="handleRefund(item.id)"
                      >
                        {{ item.status === '6' ? 'Cancel Refund' : 'Request Refund' }}
                      </el-button>
                      <el-button
                        v-if="item.status === '5'"
                        type='primary'
                        size='small'
                        @click="$router.push({ path: `/order/comment/add/${item.id}` })"
                      >
                        Comment
                      </el-button>
                    </div>
                    <div class="count">x{{ item.quantity }}</div>
                  </li>
                </ul>
              </div>
              <div class="column state">
                <p>{{ stateMap[order.status] }}</p>
                <p v-if="order.status === '4'">
                  <a class="green">Track Shipping</a>
                </p>
              </div>
              <div class="column amount">
                <p class="red">¥{{ (order.payMoney + order.postFee).toFixed(2) }}</p>
                <p v-if="order.postFee > 0">(Shipping: ¥{{ order.postFee.toFixed(2) }})</p>
              </div>
              <div class="column action">
                <div class="button-group">
                  <el-button
                    v-if="order.status === '0'"
                    type="primary"
                    size="small"
                    @click="$router.push(`/pay/${order.id}`)"
                  >
                    Pay Now
                  </el-button>

                  <el-button
                    v-if="order.status === '0'"
                    type="danger"
                    size="small"
                    @click="handleCancelOrder(order.id)"
                  >
                    Cancel Order
                  </el-button>
                </div>
                <p><a @click="$router.push(`/order/detail/${order.id}`)">View Details</a></p>
                <p v-if="[3,4,5].includes(order.status)">
                  <a>Buy Again</a>
                </p>
              </div>
            </div>
          </div>

          <!-- 分页 -->
          <div class="pagination-container">
            <el-pagination
              :total="total"
              :current-page="currentPage"
              :page-size="2"
              background
              layout="prev, pager, next"
              @current-change="pageChange"
            />
          </div>
        </div>
      </div>
    </el-tabs>
  </div>
</template>

<style scoped lang="scss">
/* 保持原有样式不变 */
.order-container {
  padding: 10px 20px;

  .pagination-container {
    display: flex;
    justify-content: center;
  }

  .main-container {
    min-height: 500px;

    .holder-container {
      min-height: 500px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

.order-item {
  margin-bottom: 20px;
  border: 1px solid #f5f5f5;
  margin-left: 0;
  .head {
    height: 50px;
    line-height: 50px;
    background: #f5f5f5;
    padding: 0 20px;
    overflow: hidden;

    span {
      margin-right: 20px;

      &.down-time {
        margin-right: 0;
        float: right;

        i {
          vertical-align: middle;
          margin-right: 3px;
        }

        b {
          vertical-align: middle;
          font-weight: normal;
        }
      }

      &.filter-tip {
        margin-right: 0;
        float: right;
        color: #666;
        font-size: 12px;
      }
    }
  }

  .body {
    display: flex;
    align-items: stretch;

    .column {
      border-left: 1px solid #f5f5f5;
      text-align: center;
      padding: 20px;
      > p {
        padding-top: 10px;
      }
      &:first-child {
        border-left: none;
      }

      &.goods {
        flex: 1;
        padding: 0;
        align-self: center;

        ul {
          li {
            border-bottom: 1px solid #f5f5f5;
            padding: 10px;
            display: flex;
            position: relative;

            &:last-child {
              border-bottom: none;
            }

            .image {
              width: 70px;
              height: 70px;
              border: 1px solid #f5f5f5;
            }

            .info {
              width: 220px;
              text-align: left;
              padding: 0 10px;

              p {
                margin-bottom: 5px;

                &.name {
                  height: 38px;
                }

                &.attr {
                  color: #999;
                  font-size: 12px;
                }
              }
            }

            .price {
              width: 100px;
            }

            .count {
              width: 80px;
              display: flex;
              align-items: center;
              justify-content: center;
              text-align: center;
            }

            .action {
              position: absolute;
              right: 20px;
              bottom: 10px;
            }
          }
        }
      }

      &.state {
        width: 120px;

        .green {
          color: $xtxColor;
          cursor: pointer;
        }
      }

      &.amount {
        width: 200px;

        .red {
          color: $priceColor;
        }
      }

      &.action {
        width: 140px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        justify-content: center;

        .button-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;

          .el-button {
            width: 100%;
            min-width: 0;
            margin: 0 !important;
          }
        }

        a {
          display: block;
          cursor: pointer;

          &:hover {
            color: $xtxColor;
          }
        }
      }
    }
  }
}

.info {
  position: relative;
  .status-tag {
    position: absolute;
    right: -10px;
    top: 50%;
    transform: translateY(-50%);
    margin-right: 15px;
  }

  p.time {
    color: #666;
    font-size: 12px;
    margin-top: 5px;
  }
}
</style>
