<script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { getOrderByIdAPI, updateOrderItemAPI } from '@/apis/checkout'
  import { getAddressAPI } from '@/apis/address'
  import { useUserStore } from '@/stores/user'

  const route = useRoute()
  const router = useRouter()
  const order = ref(null)
  const loading = ref(true)
  const error = ref(null)
  const userStore = useUserStore()
  const defaultAddress = ref(null)

  const statusMap = {
    '0': { text: 'Unpaid', type: 'warning' },
    '1': { text: 'Paid', type: 'success' },
    '2': { text: 'Cancel', type: 'info' },
  }

  const itemStateMap = {
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
  };

  const fetchOrderDetail = async () => {
    try {
      const orderId = route.params.id

      const { data } = await getOrderByIdAPI(orderId)

      console.log('API Response:', data); // Debug the entire API response

      // 根据接口返回结构调整映射关系
      order.value = {
        id: data.id,
        createTime: data.createdTime, // 注意字段名匹配
        status: data.orderStatus,
        payMoney: parseFloat(data.amount),
        postFee: data.post_fee || 0,
        totalQuantity: data.products.reduce((total, item) => total + item.count, 0), // 计算商品总数
        skus: data.products.map(item => {
          console.log('Item Status:', item.item_status); // Debug item_status
          console.log('Item Id:', item.item_id); 
          console.log('Time:', item.updated_time); 
          return {
            id: item.item_id,
            image: item.image || '/placeholder.svg',
            status: item.item_status,
            name: item.name,
            attrsText: item.attrsText,
            realPay: item.price,
            quantity: item.count, 
            updatedTime: item.updated_time,
            subtotal: item.price * item.count // 计算 subtotal
          }
        })
      }
      loading.value = false
    } catch (err) {
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

  const formatFullLocation = (address) => {
    if (!address) return ''
    return address.province === address.city 
      ? `${address.district}, ${address.province}`
      : `${address.district}, ${address.city}, ${address.province}`
  }

  const fetchDefaultAddress = async () => {
    try {
      const res = await getAddressAPI(userStore.userInfo.id)
      const addresses = res.data || []
      defaultAddress.value = addresses.find(addr => addr.is_default) || null
    } catch (error) {
      ElMessage.error('Failed to fetch address: ' + error.message)
    }
  }

  // Confirm receipt
  const handleConfirmReceipt = async (itemId) => {
    try {
      const res = await updateOrderItemAPI({
        itemId: itemId,
        itemStatus: '5'
      });

      if (res.code === 200) {
        ElMessage.success('Receipt confirmed successfully');
        await fetchOrderDetail(); // Refresh order details
      } else {
        ElMessage.error(`Operation failed: ${res.message || 'Unknown error'}`);
      }
    } catch (error) {
      ElMessage.error(`Operation failed: ${error.response?.data?.message || error.message}`);
    }
  };

  // Handle refund
  const handleRefund = async (itemId) => {
    try {
      const currentItem = order.value.skus.find(item => item.id === itemId);

      if (!currentItem) {
        ElMessage.error('未找到对应订单项');
        return;
      }

      const isApplying = currentItem.status !== '6';
      const actionName = isApplying ? 'request refund' : 'cancel refund';

      await ElMessageBox.confirm(
        `Are you sure to ${actionName}?`,
        'Confirmation',
        {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      );

      const targetStatus = isApplying ? '6' : '7';
      const res = await updateOrderItemAPI({
        itemId: itemId,
        itemStatus: targetStatus
      });

      if (res.code === 200) {
        ElMessage.success(`${actionName} successful`);
        await fetchOrderDetail(); // Refresh order details
      }
    } catch (error) {
      if (error !== 'cancel') {
        ElMessage.error(`Operation failed: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  onMounted(async () => {
    await fetchOrderDetail()
    await fetchDefaultAddress()
  })
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
        <h2>Order ID: {{ order.id }}</h2>
        <el-tag :type="statusMap[order.status]?.type || 'info'">
          {{ statusMap[order.status]?.text || '未知状态' }}
        </el-tag>
      </div>
      <!-- 地址显示 -->
      <div class="address-section">
        <h3 class="section-title">Address</h3>
        <div class="address-content" v-if="defaultAddress">
          <p><span class="label">Recipient:</span>{{ defaultAddress.recipient }}</p>
          <p><span class="label">Contact:</span>{{ defaultAddress.phone }}</p>
          <p><span class="label">Address:</span>
            {{ defaultAddress.additional_addr }}, 
            {{ formatFullLocation(defaultAddress) }}
          </p>
        </div>
        <div class="empty-address" v-else>
          <el-empty description="No default address found" :image-size="60" />
        </div>
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
              <span class="subtotal">¥{{ item.subtotal.toFixed(2) }}</span>
            </div>
            <el-tag
              :type="itemStateMap[item.status]?.type"
              size="small"
              class="status-tag"
            >
              {{ itemStateMap[item.status]?.text || 'Unknown status' }}
            </el-tag>
            <p class="time" v-if="item.updatedTime">
              Last updated: {{ formatDateTime(item.updatedTime) }}
            </p>
            <p class="time" v-else>
              Last updated: Unknown
            </p>
            <div class="action">
              <el-button
                v-if="item.status === '4'"
                type="success"
                size="small"
                @click="handleConfirmReceipt(item.id)"
              >
                Confirm Receipt
              </el-button>
              <el-button
                v-if="['1', '3', '4', '5', '9'].includes(item.status)"
                type="warning"
                size="small"
                @click="handleRefund(item.id)"
              >
                {{ item.status === '6' ? 'Cancel Refund' : 'Request Refund' }}
              </el-button>
              <el-button
                v-if="item.status === '5'"
                type='primary'
                size='small'
                @click="$router.push({ path: `/order/comment/add/${item.id}` })"
              >
                Comment Now
              </el-button>
              <el-button
                v-if="item.status === '8'"
                type='default'
                size='small'
                @click="$router.push({ path: `/order/comment/review/${item.id}` })"
              >
                View my comment
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 订单信息 -->
      <el-descriptions
        title="Order Info"
        border
        :column="2"
        class="order-info"
      >
        <el-descriptions-item label="Order created at">
          {{ formatDateTime(order.createTime) }}
        </el-descriptions-item>
        <el-descriptions-item label="Account Paid">
          ¥{{ order?.payMoney.toFixed(2) }}
        </el-descriptions-item>
        <el-descriptions-item label="Post Fee">
          ¥{{ order.postFee }}
        </el-descriptions-item>
        <el-descriptions-item label="Total Quantity">
          {{ order.totalQuantity }}
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
            color: #333;
            font-size: 16px;
            font-weight: bold;
          }

          .quantity {
            color: #666;
          }

          .subtotal {
            color: #e4393c;
            font-size: 16px;
            font-weight: bold;
          }
        }

        .status-tag {
          margin-top: 8px;
        }

        .time {
          color: #999;
          font-size: 12px;
          margin-top: 8px;
        }

        .action {
          margin-top: 8px;
          display: flex;
          gap: 8px;
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

  .address-section {
    margin-top: 30px;
    padding: 20px;
    border: 1px solid #eee;
    border-radius: 4px;

    .section-title {
      font-size: 16px;
      color: #666;
      margin-bottom: 15px;
    }

    .address-content {
      p {
        margin: 8px 0;
        font-size: 14px;
        
        .label {
          color: #999;
          margin-right: 10px;
          width: 80px;
          display: inline-block;
        }
      }
    }

    .empty-address {
      padding: 20px 0;
    }
  }
}
</style>
