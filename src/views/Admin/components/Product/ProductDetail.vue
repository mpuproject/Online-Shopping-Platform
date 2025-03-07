<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAdminProductAPI, editProductAPI, deleteProductAPI } from '@/apis/detail'
import { useRoute, useRouter } from 'vue-router'
import { getSubcategoryAPI } from '@/apis/subcategory'
import { getCategoryAPI } from '@/apis/category'
import { postImageAPI } from '@/apis/image'

const route = useRoute()
const router = useRouter()

// 编辑状态
const isEditing = ref(false)
const formRef = ref(null)

// 商品数据
const formData = ref({
  id: '',
  name: '',
  description: '',
  price: 0,
  images: [],
  stock_quantity: 0,
  low_stock_threshold: 10,
  details: [],
  rating: 0,
  status: '1',
  sub_category: [],
  createdTime: '',
  updatedTime: ''
})

const categoryPath = ref([])
const originalFormData = ref({}) // 用于存储原始数据

const getAdminProduct = async () => {
  const res = await getAdminProductAPI(route.params.id);
  //获取路径
  categoryPath.value = [res.data.category.name, res.data.sub_category.name];
  formData.value = res.data;
  formData.value.price = Number(formData.value.price)
  formData.value.sub_category = [res.data.category.id, res.data.sub_category.id];

  // 保存原始数据
  originalFormData.value = { ...formData.value };

  // 转换图片格式
  formData.value.images = formData.value.images.map(url => ({
    url,
    name: url.split('/').pop(),
    status: 'success'
  }))
}

onMounted(() => { getAdminProduct(); })

// 表单验证规则
const rules = reactive({
  name: [
    { required: true, message: 'Name cannot be empty', trigger: 'blur' },
    { min: 2, max: 255, message: 'The value must contain 2 to 255 characters', trigger: 'blur' }
  ],
  price: [
    { required: true, message: 'Price cannot be empty', trigger: 'blur' }
  ],
  stockQuantity: [
    { required: true, message: 'Quantity cannot be empty', trigger: 'blur' }
  ],
  lowStockThreshold: [
    { required: true, message: 'Threshold cannot be empty', trigger: 'blur' }
  ],
  status: [
    { required: true, message: 'Status cannot be empty', trigger: 'change' }
  ],
  subCategoryId: [
    { required: true, message: 'Subcategory cannot be empty', trigger: 'change' }
  ]
})

// 分类选项
const categoryOptions = ref([])

const getCategoryOptions = async () => {
  const subList = await getSubcategoryAPI()
  const cateList = await getCategoryAPI()

  // 将子分类按父分类ID分组
  const subMap = subList.data.reduce((map, sub) => {
    if (!map[sub.category_id]) {
      map[sub.category_id] = []
    }
    map[sub.category_id].push({
      id: sub.id,
      name: sub.name
    })
    return map
  }, {})

  // 组装层级结构
  categoryOptions.value = cateList.data.map(cate => ({
    id: cate.id,
    name: cate.name,
    children: subMap[cate.id] || []
  }))
}

onMounted( () => { getCategoryOptions() })

// 获取分类路径
const getCategoryPath = computed(() => {
  return `${categoryPath.value[0]} / ${categoryPath.value[1]}`
})

// 自定义上传逻辑
const handleUpload = async (options) => {
  const { file } = options
  const res = await postImageAPI(file)
  if (res && res.url) {
    return res
  } else {
    throw new Error('Upload failed')
  }
}

// 处理编辑
const handleEdit = () => {
  if (isEditing.value) {
    // 取消编辑
    isEditing.value = false
  } else {
    // 进入编辑模式
    try{
      isEditing.value = true
    } catch(err){
      console.error(err)
    }
  }
}

// 处理重置
const handleReset = async () => {
  try {
    await ElMessageBox.confirm(
      'Are you sure to reset the form? All unsaved changes will be lost.',
      'Warning',
      {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    )
    formData.value = { ...originalFormData.value }
    ElMessage.success('Form reset successfully')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to reset form')
    }
  }
}

// 处理删除
const handleDelete = async () => {
  try {
    await ElMessageBox.confirm(
      'The operation is uncoverable. Are you sure to continue?',
      'Warning',
      {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    )
    // TODO: 实现删除逻辑
    await deleteProductAPI(route.params.id)
    ElMessage.success('Product deleted')
    // 删除后跳转到列表页
    router.replace('/admin/product')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to delete')
    }
  }
}

// 处理保存
const handleSave = async () => {
  await formRef.value.validate( async (valid) => {
    if (valid) {
      // 在提交前统一处理 images 数组
      const processedImages = formData.value.images.map(img => {
        if (img && typeof img === 'object' && img.url) {
          return img.url; // 如果是对象，提取 url
        }
        return img; // 如果是字符串，直接返回
      });

      // 更新 formData 中的 images
      const payload = {
        ...formData.value,
        images: processedImages
      };

      await editProductAPI(route.params.id, payload);
      ElMessage.success('Information saved');
      isEditing.value = false;
      getAdminProduct();
    } else {
      ElMessage.error('Please check the form');
      return false;
    }
  });
}

// 处理图片上传成功
const handleUploadSuccess = (response) => {
  if (response && response.url) {
    formData.value.images.push(response.url)
    ElMessage.success('Image uploaded successfully')
  } else {
    ElMessage.error('Failed: unvalid URL in return')
  }
}

// 处理图片删除
const handleRemove = (file) => {
  const index = formData.value.images.findIndex(img => img.url === file.url)
  if (index !== -1) {
    formData.value.images.splice(index, 1)
  }
}

// 添加商品详细信息
const addDetail = () => {
  formData.value.details.push({ key: '', value: '' })
}

// 删除商品详细信息
const removeDetail = (index) => {
  formData.value.details.splice(index, 1)
}

// 格式化日期
const formatDate = (date) => {
  return new Date(date).toLocaleString()
}
</script>

<template>
  <div class="product-detail-container">
    <el-card class="detail-card">
      <template #header>
        <div class="card-header">
          <h2 class="detail-title">Product Information</h2>
          <div class="header-actions">
            <el-button
              :type="isEditing? 'default' : 'primary'"
              @click="handleEdit"
            >
              {{ isEditing ? 'Undo' : 'Edit' }}
            </el-button>
            <el-button
              v-if="isEditing"
              type="default"
              @click="handleReset()"
            >
              Reset
            </el-button>
            <el-button
              v-if="!isEditing"
              type="danger"
              @click="handleDelete"
            >
              Delete
            </el-button>
            <el-button
              v-else
              type="primary"
              @click="handleSave"
            >
              Submit
            </el-button>
          </div>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
        class="product-form"
      >
        <!-- 基本信息 -->
        <el-form-item label="ID" prop="id">
          <template v-if="isEditing">
            <div class="detail-text">{{ formData.id }}</div>
          </template>
          <template v-else>
            <div class="detail-text">{{ formData.id }}</div>
          </template>
        </el-form-item>

        <el-form-item label="Name" prop="name">
          <template v-if="isEditing">
            <el-input
              v-model="formData.name"
              placeholder="Input product name"
            />
          </template>
          <template v-else>
            <div class="detail-text">{{ formData.name }}</div>
          </template>
        </el-form-item>

        <el-form-item label="Description" prop="description">
          <template v-if="isEditing">
            <el-input
              v-model="formData.description"
              type="textarea"
              :rows="4"
              placeholder="Input description"
            />
          </template>
          <template v-else>
            <div class="detail-text">{{ formData.description }}</div>
          </template>
        </el-form-item>

        <el-form-item label="Price" prop="price">
          <template v-if="isEditing">
            <el-input-number
              v-model="formData.price"
              :precision="2"
              :step="0.1"
              :min="0"
            />
          </template>
          <template v-else>
            <div class="detail-text">¥ {{ formData.price }}</div>
          </template>
        </el-form-item>

        <!-- 库存信息 -->
        <el-form-item label="Inventory" prop="stock_quantity">
          <template v-if="isEditing">
            <el-input-number
              v-model="formData.stock_quantity"
              :min="0"
              :step="1"
            />
          </template>
          <template v-else>
            <div class="detail-text">{{ formData.stock_quantity }}</div>
          </template>
        </el-form-item>

        <el-form-item label="Alarm" prop="low_stock_threshold">
          <template v-if="isEditing">
            <el-input-number
              v-model="formData.low_stock_threshold"
              :min="0"
              :step="1"
            />
          </template>
          <template v-else>
            <div class="detail-text">{{ formData.low_stock_threshold }}</div>
          </template>
        </el-form-item>

        <!-- 商品状态 -->
        <el-form-item label="Status" prop="status">
          <template v-if="isEditing">
            <el-select v-model="formData.status" placeholder="Choose status">
              <el-option label="Available" value="1" />
              <el-option label="Unavailable" value="0" />
            </el-select>
          </template>
          <template v-else>
            <el-tag :type="formData.status === '1' ? 'success' : 'danger'">
              {{ formData.status === '1' ? 'Available' : 'Unavailable' }}
            </el-tag>
          </template>
        </el-form-item>

        <!-- 商品分类 -->
        <el-form-item label="Subcategory" prop="sub_category">
          <template v-if="isEditing">
            <el-cascader
              v-model="formData.sub_category"
              :options="categoryOptions"
              :props="{
                checkStrictly: true,
                label: 'name',
                value: 'id',
              }"
              placeholder="Choose subcategory"
            />
          </template>
          <template v-else>
            <div class="detail-text">{{ getCategoryPath }}</div>
          </template>
        </el-form-item>

        <!-- 商品图片 -->
        <el-form-item label="Images" prop="images">
          <template v-if="isEditing">
            <el-upload
              action="#"
              :http-request="handleUpload"
              list-type="picture-card"
              :limit="5"
              :on-success="handleUploadSuccess"
              :on-remove="handleRemove"
              :file-list="formData.images"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
          </template>
          <template v-else>
            <div class="image-list">
              <el-image
                v-for="(image, index) in formData.images"
                :key="index"
                :src="image.url"
                fit="cover"
                class="product-image"
                :preview-src-list="formData.images"
                :initial-index="index"
              />
            </div>
          </template>
        </el-form-item>

        <!-- 商品详细信息 -->
        <el-form-item label="Details">
          <template v-if="isEditing">
            <div class="details-container">
              <div class="details-list">
                <div v-for="(detail, index) in formData.details"
                  :key="index"
                  class="detail-item"
                >
                <el-input
                  v-model="Object.keys(detail)[0]"
                  placeholder="attribute"
                  class="detail-input"
                />
                <el-input
                  v-model="detail[Object.keys(detail)[0]]"
                  placeholder="value"
                  class="detail-input"
                />
                <el-button type="danger" @click="removeDetail(index)">Delete</el-button>
              </div>
            </div>
            <div class="add-detail-button">
              <el-button type="primary" @click="addDetail">Add details</el-button>
            </div>
          </div>
          </template>
          <template v-else>
            <el-descriptions :column="1" border>
              <el-descriptions-item
                v-for="(detail, index) in formData.details"
                :key="index"
                :label="Object.keys(detail)[0]"
              >
                {{ detail[Object.keys(detail)[0]] }}
              </el-descriptions-item>
            </el-descriptions>
          </template>
        </el-form-item>

        <!-- 创建和更新时间 -->
        <el-form-item label="Created time">
          <div class="detail-text">{{ formatDate(formData.createdTime) }}</div>
        </el-form-item>

        <el-form-item label="Updated time">
          <div class="detail-text">{{ formatDate(formData.updatedTime) }}</div>
        </el-form-item>

        <!-- 商品评分 -->
        <el-form-item label="Rating">
          <el-rate
            v-model="formData.rating"
            :max="5"
            disabled
            show-score
            text-color="#ff9900"
          />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.product-detail-container {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.detail-card {
  width: 800px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-title {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.product-form {
  margin-top: 20px;
}

.detail-text {
  line-height: 1.5;
  color: #606266;
}

.details-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.details-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-item {
  display: flex;
  gap: 10px;
}

.detail-input {
  width: 200px;
}

.add-detail-button {
  margin-top: 0px;  /* 可以调整这个值来改变按钮与上方内容的间距 */
}

.product-image {
  width: 100px;
  height: 100px;
  margin-right: 10px;
  border-radius: 4px;
  object-fit: cover;
}

:deep(.el-upload--picture-card) {
  width: 100px;
  height: 100px;
  line-height: 100px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-descriptions-item__label) {
  width: 200px;
}
</style>
