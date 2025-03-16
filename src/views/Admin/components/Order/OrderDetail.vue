<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getOrderDetailAPI, updateOrderStatusAPI } from '@/apis/order'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const orderDetail = ref(null)

// 完整状态映射
const statusMap = {
  '0': { text: 'Unpaid', type: 'warning' },
  '1': { text: 'Pending', type: 'success' },
  '2': { text: 'Cancelled', type: 'info' },
  '3': { text: 'Shipped', type: 'primary' },
  '4': { text: 'Delivered', type: '' },
  '5': { text: 'Received', type: 'success' },
  '6': { text: 'Refund Pending', type: 'danger' },
  '7': { text: 'Refunded', type: 'info' },
  '8': { text: 'Done', type: 'success' },
  '9': { text: 'Hold', type: 'success' }
}

// 修改状态转换规则
const getAvailableStatuses = (currentStatus) => {
  switch (currentStatus) {
    case '1': return ['9', '2']  // 待处理 -> 可改为暂挂或取消
    case '9': return ['3']       // 暂挂 -> 可改为已发货
    case '3': return ['4']       // 已发货 -> 可改为已送达
    case '6': return ['7']       // 退款中 -> 可改为已退款
    default: return []           // 其他状态不可修改
  }
}

// 添加时间格式化函数
const formatDateTime = (isoString) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).replace(/\//g, '-')
}

const fetchOrderDetail = async () => {
  try {
    const orderId = route.params.id
    const res = await getOrderDetailAPI(orderId)
    // 根据新的数据结构调整映射
    orderDetail.value = {
      id: res.data.id,
      orderStatus: res.data.order_status,
      items: res.data.items.map(item => ({
        id: item.id,
        product: {
          id: item.product.id,
          name: item.product.name,
          image: item.product.image,
          count: item.product.count
        },
        itemStatus: item.item_status,
        quantity: item.quantity,
        price: item.price,
        createdTime: item.created_time
      }))
    }
    console.log('订单详情数据:', orderDetail.value)
  } catch (error) {
    ElMessage.error('获取订单详情失败: ' + error.message)
  }
}

// 更新商品状态
const updateStatus = async (itemId, oldStatus, newStatus) => {
  try {
    if (oldStatus === newStatus) return

    if (!getAvailableStatuses(oldStatus).includes(newStatus)) {
      ElMessage.error('非法的状态转换')
      return
    }

    await ElMessageBox.confirm(
      `确认将状态从【${statusMap[oldStatus].text}】改为【${statusMap[newStatus].text}】?`,
      '警告',
      { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
    )

    await updateOrderStatusAPI(itemId, { oldStatus, newStatus })
    ElMessage.success('状态更新成功')
    fetchOrderDetail() // 刷新数据
  } catch (error) {
    if (error !== 'cancel') ElMessage.error('更新失败: ' + error.message)
  }
}

// 添加计算总金额的方法
const calculateTotalPrice = (items) => {
  if (!items || !items.length) return 0
  return items.reduce((total, item) => {
    return total + (item.price * item.quantity)
  }, 0)
}

onMounted(() => {
  fetchOrderDetail()
})
</script>

<template>
  <div class="order-detail" v-if="orderDetail">
    <!-- 订单头 -->
    <div class="header">
      <h2>订单编号：{{ orderDetail.id }}</h2>
    </div>

    <!-- 基本信息 -->
    <el-descriptions border :column="2" class="order-info">
      <el-descriptions-item label="下单时间">
        {{ formatDateTime(orderDetail.items[0]?.createdTime) }}
      </el-descriptions-item>
      <el-descriptions-item label="订单总额">
        ¥{{ calculateTotalPrice(orderDetail.items)?.toFixed(2) }}
      </el-descriptions-item>
    </el-descriptions>

    <!-- 商品列表 -->
    <el-card class="goods-list">
      <template #header>
        <h3>商品明细 (共{{ orderDetail.items?.length || 0 }}件)</h3>
      </template>

      <el-table :data="orderDetail.items" border>
        <el-table-column label="商品图片" width="120">
          <template #default="{ row }">
            <el-image
              :src="row.product.image"
              style="width: 80px; height: 80px"
              :preview-src-list="[row.product.image]"
            />
          </template>
        </el-table-column>

        <el-table-column prop="product.name" label="商品名称" />

        <el-table-column label="数量" width="100" align="center">
          <template #default="{ row }">{{ row.quantity }}</template>
        </el-table-column>

        <el-table-column label="单价" width="120" align="right">
          <template #default="{ row }">¥{{ row.price.toFixed(2) }}</template>
        </el-table-column>

        <el-table-column label="状态" width="200" align="center">
          <template #default="{ row }">
            <el-button-group>
              <el-button
                v-for="status in getAvailableStatuses(row.itemStatus)"
                :key="status"
                :type="statusMap[status].type"
                @click="updateStatus(row.id, row.itemStatus, status)"
              >
                {{ statusMap[status].text }}
              </el-button>
            </el-button-group>
            <el-tag v-if="!getAvailableStatuses(row.itemStatus).length" type="info">
              不可修改
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.order-detail {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  .header {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 30px;

    h2 {
      margin: 0;
      font-size: 24px;
    }
  }

  .order-info {
    margin-bottom: 30px;

    :deep(.el-descriptions__body) {
      background-color: #f8f9fa;
    }
  }

  .goods-list {
    :deep(.el-card__header) {
      background-color: #f8f9fa;
      h3 {
        margin: 0;
        font-size: 16px;
        color: #333;
      }
    }
  }

  .el-image {
    border-radius: 4px;
    overflow: hidden;
  }
}
</style>