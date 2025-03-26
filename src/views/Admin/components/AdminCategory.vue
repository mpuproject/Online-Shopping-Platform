<script setup>
import { ref } from 'vue'
import { Plus, Search, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, imageProps } from 'element-plus'
import {addCategoryAPI, updateCategoryAPI, deleteCategoryAPI, getCategoryAPI } from '@/apis/category'
import { postImageAPI } from '@/apis/image' 

// 表格数据
const tableData = ref([])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 获取分类数据
const fetchCategories = async () => {
  try {
    const response = await getCategoryAPI()    
    tableData.value = response.data.map(category => ({
      id: category.id,
      name: category.name,
      status: category.status,
      image: category.images
    }))
    total.value = tableData.value.length
  } catch (error) {
    ElMessage.error('获取分类数据失败')
  }
}

// 初始化时获取数据
fetchCategories()

// 添加分类
const handleAdd = async () => {
  try {
    const { value: name } = await ElMessageBox.prompt('Enter the new Category Name', 'Adding Category', {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      inputPattern: /\S+/, // 非空验证
      inputErrorMessage: 'Category Name cannot be Null'
    })

    const response = await addCategoryAPI(name)
    ElMessage.success('添加成功')
    fetchCategories() // 刷新数据
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('添加失败')
    }
  }
}

// 编辑分类
const handleEdit = async (row) => {
  try {
    const { value: name } = await ElMessageBox.prompt('Enter the new Category Name', 'Editing Category', {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      inputValue: row.name,
      inputPattern: /\S+/, // 非空验证
      inputErrorMessage: 'Category Name cannot be Null'
    })

    const status = row.status ? '1' : '0'
    await updateCategoryAPI(row.id, name, status)
    ElMessage.success('更新成功')
    fetchCategories() // 刷新数据
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('更新失败')
    }
  }
}

// 修改分类状态
const handleStatusChange = async (row) => {
  try {
    const status = row.status ? '1' : '0'
    await updateCategoryAPI(row.id, row.name, status)
    ElMessage.success('状态更新成功')
    fetchCategories()
  } catch (error) {
    console.error('状态更新失败:', error)
    ElMessage.error('状态更新失败')
  }
}

// 删除分类
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除 "${row.name}" 吗？`,
      '警告',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    await deleteCategoryAPI(row.id)
    ElMessage.success('删除成功')
    fetchCategories() // 刷新数据
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 图片上传成功处理
const handleImageUploadSuccess = async (response, row) => {
  try {
    const imageUrl = response.data.url
    console.log(response);
    await updateCategoryAPI(row.id, row.name, row.status, imageUrl) // 更新分类图片
    ElMessage.success('图片上传成功')
    fetchCategories() // 刷新数据
  } catch (error) {
    console.error('图片上传失败:', error)
    ElMessage.error('图片上传失败')
  }
}

// 图片上传失败处理
const handleImageUploadError = (error) => {
  console.error('图片上传失败:', error)
  ElMessage.error('图片上传失败')
}

// 图片管理对话框
const imageDialogVisible = ref(false)
const currentRow = ref([])

const openImageDialog = (row) => {
  currentRow.value = row.image
  imageDialogVisible.value = true
}

const handleCloseImageDialog = () => {
  currentRow.value = null
  imageDialogVisible.value = false
}

const handleDeleteImage = async (row, image) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete "${image}"?`,
      'Warning',
      {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    )

    await updateCategoryAPI(row.id, row.name, row.status, null) // 删除图片
    ElMessage.success('image success to delete')
    fetchCategories() // 刷新数据
    handleCloseImageDialog()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('image fail to delete')
    }
  }
}

// 图片上传处理
const handleUpload = async (options) => {
  const { file } = options;
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await postImageAPI(formData); 
    await handleImageUploadSuccess(response, currentRow.value); 
  } catch (error) {
    await handleImageUploadError(error); 
  }
};
</script>

<template>
  <div class="content-table">
    <!-- 顶部操作区 -->
    <div class="top-actions">
      <el-button type="primary" @click="handleAdd" class="add-btn">
        <el-icon><Plus /></el-icon>Add
      </el-button>

      <!-- <el-input
        v-model="searchKeyword"
        placeholder="请输入关键词搜索"
        class="search-bar"
        clearable
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input> -->
    </div>

    <!-- 表格 -->
    <el-table
      :data="tableData"
      style="width: 100%"
      border
      stripe
    >
      <el-table-column prop="id" label="ID" width="350" />
      <el-table-column prop="name" label="Name" min-width="80" />
      <el-table-column prop="status" label="Status" width="100">
        <template #default="{ row }">
          <el-switch
            :model-value="row.status === '1'"
            @change="handleStatusChange(row)"
          >
            {{ row.status === '1' ? 'Avail' : 'NA' }}
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="Image" width="150">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="openImageDialog(row)">
            Manage Image
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="Handle" width="180" fixed="right">
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

    <!-- 图片管理对话框 -->
    <el-dialog
      v-model="imageDialogVisible"
      title="Manage Image"
      width="30%"
      :before-close="handleCloseImageDialog"
    >
      <div>
        <div v-if="currentRow" class="image-preview">
          <div v-for="image in currentRow" class="image-container">
            <img :src="image" alt="Category Image" class="category-image" />
            <div class="overlay">
              <el-icon class="delete-icon" @click="handleDeleteImage(currentRow, image)">
                <Delete />
              </el-icon>
            </div>
          </div>
        </div>
        <div v-else>
          <p>No image available.</p>
        </div>

        <!-- 图片上传区域 -->
        <el-upload
          :http-request="handleUpload"
          :on-success="(response) => handleImageUploadSuccess(response, currentRow)"
          :on-error="handleImageUploadError"
          :show-file-list="false"
          class="upload-box"
          style="margin-top: 10px;"
        >
          <div class="upload-content">
            <el-icon class="upload-icon"><Plus /></el-icon>
            <p class="upload-text">Click or drag to upload</p>
            <p class="upload-tip">Supports JPG/PNG format, max size 20MB</p>
          </div>
        </el-upload>
      </div>
    </el-dialog>
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

.image-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.image-container {
  position: relative;
  width: 100%; 
  height: 250px; 
  overflow: hidden;
  border-radius: 4px;
}

.category-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明黑色背景 */
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-container:hover .overlay {
  opacity: 1; /* 悬停时显示覆盖层 */
}

.image-container:hover .category-image {
  opacity: 0.7; /* 悬停时图片变暗 */
}

.delete-icon {
  color: white;
  font-size: 24px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.delete-icon:hover {
  color: $xtxColor; /* 悬停时垃圾桶图标变红 */
}

.upload-box {
  width: 100%;
  height: 250px;
  border: 1px dashed $xtxColor;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
}

.upload-content {
  text-align: center;
}

.upload-icon {
  font-size: 24px;
  color: #909399;
}

.upload-text {
  margin-top: 8px;
  color: #909399;
}

.upload-tip {
  margin-top: 4px;
  font-size: 12px;
  color: #909399;
}
</style>
