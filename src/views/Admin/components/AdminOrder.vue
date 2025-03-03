<script setup>
import { onMounted, ref } from 'vue'
import { Search, InfoFilled } from '@element-plus/icons-vue'
import { getOrdersAPI, updateOrderStatusAPI } from '@/apis/order'
import { ElMessageBox, ElMessage } from 'element-plus'
import dayjs from 'dayjs'

// 完整订单状态映射（根据OrderItem状态）
const statusMap = {
  '0': { text: 'Unpaid', type: 'warning' },
  '1': { text: 'Paid', type: 'primary' },
  '2': { text: 'Canceled', type: 'danger' },
  '3': { text: 'Undelivered', type: 'info' },
  '4': { text: 'Delivered', type: 'success' },
  '5': { text: 'Received', type: 'success' },
  '6': { text: 'Unrefunded', type: 'warning' },
  '7': { text: 'Refunded', type: 'info' },
  '8': { text: 'Done', type: 'success' },
  '9': { text: 'Hold', type: 'warning' }
}

// 获取订单数据
const tableData = ref([])
const requestData = ref({
  page: 1,
  pageSize: 10,
  sortField: 'created_time',
  sortOrder: 'desc'
})

// 计算序号
const getIndex = (index) => {
  return (requestData.value.page - 1) * requestData.value.pageSize + index + 1;
};

const total = ref(0)

const getOrders = async () => {
  const res = await getOrdersAPI(requestData.value)
  tableData.value = res.data.results.map(order => ({
    ...order,
    created_time: dayjs(order.created_time).format('YYYY-MM-DD HH:mm')
  }))
  total.value = res.data.count
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

// 更新订单状态
const updateOrderStatus = async (orderId, newStatus) => {
  try {
    await ElMessageBox.confirm(
      `Confirm to change order status to "${statusMap[newStatus].text}"?`,
      'Warning',
      { confirmButtonText: 'Confirm', cancelButtonText: 'Cancel', type: 'warning' }
    )

    await updateOrderStatusAPI(orderId, { status: newStatus })
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
      />

      <el-table-column label="Total Amount" width="120" align="right">
        <template #default="{ row }">¥{{ row.total_price.toFixed(2) }}</template>
      </el-table-column>

      <el-table-column prop="status" label="Status" width="150" align="center">
        <template #default="{ row }">
          <el-select
            v-model="row.status"
            @change="(val) => updateOrderStatus(row.id, val)"
            size="small"
            class="status-select"
          >
            <el-option
              v-for="(item, key) in statusMap"
              :key="key"
              :label="item.text"
              :value="key"
              :class="`status-${key}`"
            />
          </el-select>
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
</style>
