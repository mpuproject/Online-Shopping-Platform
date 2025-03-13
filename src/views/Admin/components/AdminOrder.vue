<script setup>
import { onMounted, ref } from 'vue'
import { Search, InfoFilled } from '@element-plus/icons-vue'
import { getAdminOrdersAPI, updateOrderStatusAPI } from '@/apis/order'
import { ElMessageBox, ElMessage } from 'element-plus'
// import dayjs from 'dayjs'

// 完整订单状态映射（根据OrderItem状态）
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
  '9': {text: 'Hold', type: 'success'}
}

// 首先定义状态转换规则
const statusTransitionRules = {
  '0': ['2'],      // 未支付 -> 可以改为已取消
  '1': ['9'],      // 待处理 -> 可以改为暂挂
  '2': [],         // 已取消 -> 不可更改
  '3': [],         // 未发货 -> 不可更改
  '4': [],         // 已发货 -> 不可更改
  '5': [],         // 已收货 -> 不可更改
  '6': ['7'],      // 待退款 -> 可以改为已退款
  '7': [],         // 已退款 -> 不可更改
  '8': [],         // 已完成 -> 不可更改
  '9': ['3']       // 暂挂 -> 可以改为未发货
}

// 获取订单数据
const tableData = ref([])
const requestData = ref({
  page: 1,
  pageSize: 10,
  orderNo: '',  // 添加订单号参数
})

// 计算序号
const getIndex = (index) => {
  return (requestData.value.page - 1) * requestData.value.pageSize + index + 1;
};

const total = ref(0)

const getOrders = async () => {
  try {
    const res = await getAdminOrdersAPI(requestData.value)
    // 调整数据结构，使用 items 中的 itemStatus
    tableData.value = res.data.results.map(order => ({
      id: order.id,
      created_time: order.createdTime,
      total_price: order.totalPrice,
      // 使用第一个 item 的状态作为订单状态
      status: order.items[0]?.itemStatus || '0', // 如果没有 items，默认状态为 0
      items: order.items
    }))
    total.value = res.data.count
  } catch (error) {
    ElMessage.error('Failed to load orders')
    console.error(error)
  }
}

// 分页处理
const handlePageChange = (newPage) => {
  requestData.value.page = newPage
  getOrders()
}

const handleSizeChange = (newSize) => {
  requestData.value.pageSize = newSize
  requestData.value.page = 1
  getOrders()
}

// 获取当前状态可以转换的状态列表
const getAvailableStatuses = (currentStatus) => {
  // 获取允许转换的状态列表
  const allowedStatuses = statusTransitionRules[currentStatus] || []

  // 返回当前状态和允许转换的状态
  return [currentStatus, ...allowedStatuses]
}

// 修改状态更新方法
const updateOrderStatus = async (orderId, itemId, oldStatus, newStatus) => {
  try {
    // 检查状态转换是否允许
    const currentStatus = tableData.value
      .find(order => order.id === orderId)
      ?.items.find(item => item.id === itemId)?.itemStatus

    // 如果是选择了当前状态，不需要更新
    if (currentStatus === newStatus) {
      return
    }

    // 检查新状态是否在允许的转换列表中
    if (!statusTransitionRules[currentStatus]?.includes(newStatus)) {
      ElMessage.error('Invalid status transition')
      return
    }

    await ElMessageBox.confirm(
      `Confirm to change order status to "${statusMap[newStatus].text}"?`,
      'Warning',
      { confirmButtonText: 'Confirm', cancelButtonText: 'Cancel', type: 'warning' }
    )

    await updateOrderStatusAPI(itemId, { oldStatus: oldStatus, newStatus: newStatus })
    ElMessage.success('Status updated')
    getOrders()
  } catch (error) {
    if (error !== 'cancel') ElMessage.error('Update failed')
  }
}

onMounted(() => getOrders())

// 打开详情页
const handleOrderDetail = (row) => {
  window.open(`/admin/order/${row.id}`, '_blank')
}


</script>

<template>
  <div class="content-table">
    <!-- 顶部操作区 -->
    <div class="top-actions">
      <div class="order-stats">
        <span class="stat-item">Total Orders: {{ total }}</span>
      </div>
      <el-input
        v-model="searchKeyword"
        placeholder="Search orders..."
        class="search-bar"
        clearable
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <!-- 订单表格 -->
    <el-table
      :data="tableData"
      style="width: 100%"
      border
      default-sort="{ prop: 'created_time', order: 'descending' }"
    >
      <el-table-column label="#" width="70" align="center">
        <template #default="{ $index }">{{ getIndex($index) }}</template>
      </el-table-column>

      <el-table-column prop="id" label="Order ID" min-width="200" />

      <el-table-column
        prop="created_time"
        label="Order Time"
        width="180"
        sortable
        align="center"
      >
        <template #default="{ row }">
          {{ new Date(row.created_time).toLocaleString() }}
        </template>
      </el-table-column>

      <el-table-column label="Total Amount" width="120" align="right">
        <template #default="{ row }">¥{{ row.total_price.toFixed(2) }}</template>
      </el-table-column>

      <el-table-column label="Products" min-width="200">
        <template #default="{ row }">
          <div v-for="item in row.items" :key="item.id" class="product-item">
            <el-image
              :src="item.product.image"
              :alt="item.product.name"
              style="width: 50px; height: 50px"
            />
            <span>{{ item.product.name }} x{{ item.product.count }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="Status" width="150" align="center">
        <template v-slot:default="{ row }">
          <div v-for="item in row.items" :key="item.id" class="status-item">
            <el-select
              v-model="item.itemStatus"
              v-on:change="(val) => updateOrderStatus(row.id, item.id, item.itemStatus, val)"
              size="small"
              class="status-select"
              v-bind:disabled="!statusTransitionRules[item.itemStatus]?.length"
            >
              <el-option
                v-for="allowedStatus in getAvailableStatuses(item.itemStatus)"
                :key="allowedStatus"
                v-bind:label="statusMap[allowedStatus].text"
                v-bind:value="allowedStatus"
                v-bind:class="'status-' + allowedStatus"
              />
            </el-select>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="Actions" width="110" fixed="right" align="center">
        <template #default="{ row }">
          <el-button-group>
            <el-button type="primary" size="small" @click="handleOrderDetail(row)">
              <el-icon><InfoFilled /></el-icon>
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="requestData.page"
        v-model:page-size="requestData.pageSize"
        :page-sizes="[10, 20, 50]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        background
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.status-select {
  :deep(.el-select__tags) {
    .el-tag {
      &[data-status="0"] { background-color: #e6a23c20; color: #e6a23c; }
      &[data-status="1"] { background-color: #409eff20; color: #409eff; }
      &[data-status="2"] { background-color: #f56c6c20; color: #f56c6c; }
      &[data-status="3"] { background-color: #90939920; color: #909399; }
      &[data-status="4"] { background-color: #67c23a20; color: #67c23a; }
    }
  }
}

/* 保持原有样式不变 */
.content-table {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.top-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-bar {
  width: 300px;
}

.pagination {
  margin-top: 20px;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;

  &:last-child {
    margin-bottom: 0;
  }

  img {
    object-fit: cover;
    border-radius: 4px;
  }
}

.status-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;

  &:last-child {
    margin-bottom: 0;
  }

  .item-name {
    font-size: 12px;
    color: #666;
  }

  .status-select {
    width: 120px;
  }
}
</style>
