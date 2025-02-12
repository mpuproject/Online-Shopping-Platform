<!-- src/views/Order/index.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { 
  getOrderByUserIdAPI,
  updateOrderAPI,
} from '@/apis/checkout'

const userStore = useUserStore()
//v-if="item.status of [3, 4, ,5, 6, 7, 8]"
// 订单状态映射
const stateMap = {
  0: '待付款',
  1: '已支付',
  2: '已取消',
  3: '待发货',
  4: '待收货',
  5: '已完成'
}

// 商品状态映射
const itemStateMap = {
  '0': { text: '未支付', type: 'warning' },
  '1': { text: '已支付', type: 'success' },
  '2': { text: '已取消', type: 'info' },
  '3': { text: '已发货', type: 'primary' },
  '4': { text: '已送达', type: '' },
  '5': { text: '已签收', type: 'success' },
  '6': { text: '未退款', type: 'danger' },
  '7': { text: '已退款', type: 'info' },
  '8': { text: '已完成', type: 'success' }
}

// 标签页配置
const tabTypes = [
  { name: "all", label: "全部订单" },
  { name: "0", label: "未支付" },
  { name: "1", label: "已支付" },
  { name: "2", label: "已取消" },
  { name: "3", label: "已发货" },
  { name: "4", label: "已送达" },
  { name: "5", label: "已签收" },
  { name: "6", label: "未退款" },
  { name: "7", label: "已退款" },
  { name: "8", label: "已完成" }
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
    console.log('API请求参数:', params)
    
    const { data } = await getOrderByUserIdAPI(params)
    console.log('API响应数据:', data)
    
    orderList.value = data.results.map(order => ({
      id: order.id,
      createTime: order.created_time || '无记录时间',
      orderState: Math.max(...order.items.map(item => parseInt(item.status))), countdown: order.countdown || '00:00:00',
      skus: order.items.map(item => ({
        id: item.id,
        createdTime: item.created_time,
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
    console.error('请求失败:', error)
    ElMessage.error('获取订单失败')
  }
}

// 标签切换
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
  try {
    await updateOrderAPI({
      id: orderId,
      status: 2,
      cancel_reason: '用户取消'
    })
    ElMessage.success('订单已取消')
    await fetchOrders()
  } catch (error) {
    ElMessage.error(error.response?.data?.error || '取消失败')
  }
}

// 确认收货
const handleConfirmReceipt = async (orderId) => {
  try {
    await updateOrderAPI({
      id: orderId,
      status: 5
    })
    ElMessage.success('确认收货成功')
    await fetchOrders()
  } catch (error) {
    ElMessage.error('操作失败')
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
}
</script>

<template>
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
          <el-empty description="暂无订单数据" />
        </div>
        <div v-else>
          <!-- 订单列表 -->
          <div 
            class="order-item" 
            v-for="order in orderList" 
            :key="order.id"
          >
            <div class="head">
              <span>下单时间：{{ formatDateTime(order.createTime) }}</span>
              <span>订单编号：{{ order.id }}</span>
              <span class="filter-tip" v-if="activeTab !== 'all'">
                当前显示：{{ tabTypes.find(t => t.name === activeTab)?.label }}
              </span>
              <span class="down-time" v-if="order.orderState === 0">
                <i class="iconfont icon-down-time"></i>
                <b>付款截止: {{ order.countdown }}</b>
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
                      <p class="time" v-if="item.createdTime">
                        商品创建时间：{{ formatDateTime(item.createdTime) }}
                      </p>
                      <el-tag 
                        :type="itemStateMap[item.status]?.type"
                        size="small"
                        class="status-tag"
                      >
                        {{ itemStateMap[item.status]?.text || '未知状态' }}
                      </el-tag>
                    </div>
                    <div class="price">¥{{ (item.realPay || 0).toFixed(2) }}</div>
                    <div class="count">x{{ item.quantity }}</div>
                  </li>
                </ul>
              </div>
              <div class="column state">
                <p>{{ stateMap[order.orderState] }}</p>
                <p v-if="order.orderState === 4">
                  <a class="green">查看物流</a>
                </p>
              </div>
              <div class="column amount">
                <p class="red">¥{{ (order.payMoney + order.postFee).toFixed(2) }}</p>
                <p v-if="order.postFee > 0">（含运费：¥{{ order.postFee.toFixed(2) }}）</p>
                <p>在线支付</p>
              </div>
              <div class="column action">
                <el-button 
                  v-if="order.orderState === 0" 
                  type="primary" 
                  size="small"
                  @click="$router.push(`/order/pay/${order.id}`)"
                >
                  立即付款
                </el-button>
                <el-button 
                  v-if="order.orderState === 4" 
                  type="success" 
                  size="small"
                  @click="handleConfirmReceipt(order.id)"
                >
                  确认收货
                </el-button>
                <el-button 
                  v-if="order.orderState === 0" 
                  type="danger" 
                  size="small"
                  @click="handleCancelOrder(order.id)"
                >
                  取消订单
                </el-button>
                <p><a @click="$router.push(`/order/${order.id}`)">查看详情</a></p>
                <p v-if="[3,4,5].includes(order.orderState)">
                  <a>再次购买</a>
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