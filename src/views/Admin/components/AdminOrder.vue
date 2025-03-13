<script setup>
import { onMounted, ref } from 'vue'
import { Search, InfoFilled } from '@element-plus/icons-vue'
import { getAdminOrdersAPI } from '@/apis/order'
import { ElMessage } from 'element-plus'
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
            <el-tag
              :type="statusMap[item.itemStatus].type"
              size="small"
            >
              {{ statusMap[item.itemStatus].text }}
            </el-tag>
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
}
</style>
