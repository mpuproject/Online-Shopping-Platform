<script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import { getOrderByIdAPI } from '@/apis/checkout'

  const route = useRoute()
  const router = useRouter()
  const order = ref(null)
  const loading = ref(true)
  const error = ref(null)

  const statusMap = {
    '0': { text: '未支付', type: 'warning' },
    '1': { text: '已支付', type: 'success' },
    '2': { text: '已取消', type: 'info' },
    '3': { text: '已发货', type: 'primary' },
    '4': { text: '已送达', type: '' },
    '5': { text: '已签收', type: 'success' }
  }

  const fetchOrderDetail = async () => {
    try {
      const orderId = route.params.id
      console.log('请求订单ID:', orderId)

      const { data } = await getOrderByIdAPI(orderId)
      console.log('接口响应数据:', data)

      // 根据接口返回结构调整映射关系
      order.value = {
        id: data.id,
        createTime: data.createdTime, // 注意字段名匹配
        status: data.orderStatus,
        payMoney: parseFloat(data.amount),
        postFee: data.post_fee || 0,
        skus: data.products.map(item => ({
          id: item.id,
          image: item.image || '/placeholder.svg',
          status: item.item_status,
          name: item.name,
          attrsText: item.attrsText || '无规格',
          realPay: item.price,
          quantity: item.count,  // 注意字段名对应
          createdTime: item.created_time
        }))
      }
      loading.value = false
    } catch (err) {
      console.error('完整错误:', err)
      ElMessage.error(err.response?.data?.message || err.message)
      loading.value = false
    }
  }

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

onMounted(() => { fetchOrderDetail() })
</script>

<template>
  <div class="order-detail">
    <!-- 返回按钮 -->
    <el-button
      type="text"
      @click="router.push({ path: '/order' })"
      class="back-btn"
    >
      <i class="el-icon-arrow-left"></i>
      Return
    </el-button>

    <!-- 订单主体内容 -->
    <div v-if="order" class="content">
      <!-- 订单头 -->
      <div class="header">
        <h2>Order ID:{{ order.id }}</h2>
        <el-tag :type="statusMap[order.status]?.type || 'info'">
          {{ statusMap[order.status]?.text || '未知状态' }}
        </el-tag>
      </div>

      <!-- 商品列表 -->
      <div class="goods-list">
        <div
          v-for="item in order.skus"
          :key="item.id"
          class="goods-item"
        >
          <el-image :src="item.image" class="goods-img" />
          <div class="goods-info">
            <h3>{{ item.name }}</h3>
            <p class="spec">{{ item.attrsText }}</p>
            <div class="price-line">
              <span class="price">¥{{ item.realPay }}</span>
              <span class="quantity">x{{ item.quantity }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 订单信息 -->
      <el-descriptions
        title="订单信息"
        border
        :column="2"
        class="order-info"
      >
        <el-descriptions-item label="Product created at">
          {{ formatDateTime(order.createTime) }}
        </el-descriptions-item>
        <el-descriptions-item label="Pay Money">
          ¥{{ order?.payMoney.toFixed(2) }}
        </el-descriptions-item>
        <el-descriptions-item label="Post Fee">
          ¥{{ order.postFee }}
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <!-- 加载状态 -->
    <el-skeleton v-if="loading" :rows="5" animated />

    <!-- 错误提示 -->
    <el-empty v-if="error" :description="error" />
  </div>
</template>

<style lang="scss" scoped>
.order-detail {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);

  .back-btn {
    margin-bottom: 20px;
    padding-left: 0;
    i {
      margin-right: 5px;
    }
  }

  .header {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;

    h2 {
      margin: 0;
      margin-right: 20px;
      font-size: 24px;
    }
  }

  .goods-list {
    margin: 30px 0;
    border: 1px solid #eee;
    border-radius: 8px;

    .goods-item {
      display: flex;
      padding: 20px;
      border-bottom: 1px solid #eee;

      &:last-child {
        border-bottom: none;
      }

      .goods-img {
        width: 120px;
        height: 120px;
        margin-right: 20px;
        border-radius: 4px;
      }

      .goods-info {
        flex: 1;
        h3 {
          margin: 0 0 10px;
          font-size: 16px;
        }

        .spec {
          color: #666;
          margin-bottom: 8px;
        }

        .price-line {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .price {
            color: #e4393c;
            font-size: 16px;
            font-weight: bold;
          }

          .quantity {
            color: #666;
          }
        }
      }
    }
  }

  .order-info {
    margin-top: 30px;

    .total {
      color: #e4393c;
      font-size: 18px;
      font-weight: bold;
    }
  }
}
</style>
