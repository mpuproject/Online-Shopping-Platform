<script setup>
import { onMounted, ref } from 'vue'
import { Plus, Search, Edit, Delete, InfoFilled } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getProductAPI} from '@/apis/detail'

const setRowClassName = ({ row }) => {
  if (row.stock_quantity === 0 && row.status == '1') {
    return 'row-red' // 库存为 0，显示浅红色
  } else if (row.stock_quantity < row.low_stock_threshold && row.status == '1') {
    return 'row-yellow' // 库存低于阈值，显示浅黄色
  }
  return ''
}

// 获取产品数据
const tableData = ref([])

const requestData = ref({
  page: 1,
  pageSize: 10,
})

const total = ref(0)

const getProducts = async () => {
  const res = await getProductAPI(requestData.value)
  tableData.value = res.data.products
  total.value = res.data.total
}

// 处理页码变化
const handlePageChange = (newPage) => {
  requestData.value.page = newPage
  getProducts()
}

// 处理每页条数变化
const handleSizeChange = (newSize) => {
  requestData.value.pageSize = newSize
  requestData.value.page = 1 // 重置为第一页
  getProducts()
}

onMounted(() => { getProducts() })

const searchKeyword = ref('')

const handleAdd = () => {
  ElMessage.success('点击了新增按钮')
}

const handleEdit = (row) => {
  ElMessage.info(`正在编辑 ID: ${row.id}`)
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    `Are you sure to delete "${row.name}" ?`,
    'Warning',
    {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  ).then(() => {
    ElMessage.success('Delete successfully')
  })
}

</script>

<template>
  <div class="content-table">
    <!-- 顶部操作区 -->
    <div class="top-actions">
      <el-button type="primary" @click="handleAdd" class="add-btn">
        <el-icon><Plus /></el-icon>Add
      </el-button>

      <el-input
        v-model="searchKeyword"
        placeholder="Search by keywords"
        class="search-bar"
        clearable
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <!-- 表格 -->
    <el-table
      :data="tableData"
      style="width: 100%"
      border
      :row-class-name="setRowClassName"
    >
      <el-table-column type="index" label="ID" width="55" align="center" />
      <el-table-column prop="name" label="Name" min-width="120" />
      <el-table-column prop="rating" label="Rating" width="80" align="center" />
      <el-table-column prop="stock_quantity" label="Inventory" width="100" align="center" />
      <el-table-column prop="low_stock_threshold" label="Threshold" width="100" align="center" />
      <el-table-column prop="updatedTime" label="Last Updated" width="180"/>
      <el-table-column prop="status" label="Status" width="80" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === '1' ? 'success' : 'info'">
            {{ row.status === '1' ? 'Avail' : 'NA' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Operations" width="160" fixed="right">
        <template #default="{ row }">
          <el-button-group>
            <el-button type="primary" size="small">
              <el-icon><InfoFilled /></el-icon>
            </el-button>
            <el-button type="primary" size="small" @click="handleEdit(row)" class="custom-button">
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">
              <el-icon><Delete /></el-icon>
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
.content-table {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.top-actions {
  display: flex;
  justify-content: space-between; /* 将 Add 按钮和搜索框分开 */
  align-items: center; /* 垂直居中 */
  margin-bottom: 20px; /* 调整间距 */
}


.add-btn {
  background-color: $xtxColor;

  &:hover {
    background-color: #22978c;
  }

  &:active {
    background-color: $sucColor;
  }
}

.search-bar {
  width: 25%;
}

.pagination {
  margin-top: 30px;
}

:deep(.row-red) {
  background-color: #ffebee; // 浅红色
}

:deep(.row-yellow) {
  background-color: #fff3e0; // 浅黄色
}

.custom-button {
  background-color: #ff9800;
}
</style>
