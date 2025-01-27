<script setup>
import { ref } from 'vue'
import { Plus, Search, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 模拟数据
const tableData = ref([
  {
    id: 1,
    name: '电子产品',
    category: '主分类',
    createTime: '2024-01-26 10:00:00',
    status: true
  },
  {
    id: 2,
    name: '服装',
    category: '主分类',
    createTime: '2024-01-26 11:00:00',
    status: true
  },
  {
    id: 3,
    name: '食品',
    category: '主分类',
    createTime: '2024-01-26 12:00:00',
    status: false
  }
])

const searchKeyword = ref('')

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

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
      stripe
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="名称" min-width="150" />
      <el-table-column prop="category" label="所属分类" width="120" />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status ? 'success' : 'info'">
            {{ row.status ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button-group>
            <el-button type="primary" size="small" @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>Edit
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">
              <el-icon><Delete /></el-icon>Delete
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        background
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
</style>
