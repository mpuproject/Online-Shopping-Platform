<script setup>
import { getOrderByIdAPI, updateOrder } from '@/apis/checkout';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()

const payInfo = ref({})
const getPayInfo = async () => {
  const res = await getOrderByIdAPI(route.params.id)
  payInfo.value = res.data
}

onMounted(() => {
  getPayInfo()
})

const getPaid = async (payMethod) => {
  await updateOrder({
    orderStatus: '1',   // 已支付
    orderId: route.params.id,
    payMethod: payMethod,
  })
  router.push('/pay/success')
}

const cancel = async () => {
  ElMessageBox.confirm(
    'Are you sure to cancel the order? The operation is not reversible.',
    'Reminder',
    {
      confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning',
    }
  ).then( async () => {
    const res = await updateOrder({
      orderStatus: '2',   //修改成已取消
      orderId: route.params.id
    })
    if (res.code === 1) {
      ElMessage.success('Order has been canceled')
    } else {
      ElMessage.error('Error: ' + res.msg)
    }
  })
}
</script>


<template>
  <div class="xtx-pay-page">
    <div class="container">
      <!-- 付款信息 -->
      <div class="pay-info">
        <div class="left">
          <span class="iconfont icon-queren2 green"></span>
          <!-- <span class="iconfont icon-shanchu red"></span> -->
          <div class="tip">
            <p>Order submitted successfully! Please complete the payment as soon as possible.</p>
            <p>Payment remaining <span>24 m 30 s</span>, the order will be canceled after timeout</p>
          </div>
        </div>
        <div class="right">
          <div class="amount">
            <span>Amount: </span>
            <span>&yen;{{ payInfo.amount }}</span>
          </div>
          <button class="cancel-btn" @click="cancel">Cancel Order</button>
        </div>
      </div>
      <!-- 付款方式 -->
      <div class="pay-type">
        <p class="head">Select a payment method below</p>
        <div class="item">
          <p>Payment Platform</p>
          <a class="btn wx" href="javascript:;" @click="getPaid('0')"></a>
          <a class="btn alipay" :href="payUrl" @click="getPaid('1')"></a>
          <br />
          <br />
          <a class="btn" href="javascript:;" @click="getPaid('2')">Bank Z</a>
          <a class="btn" href="javascript:;" @click="getPaid('3')">Bank G</a>
          <a class="btn" href="javascript:;" @click="getPaid('4')">Bank J</a>
          <a class="btn" href="javascript:;" @click="getPaid('5')">Bank N</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "sass:color";

.xtx-pay-page {
  margin-top: 20px;
}

.pay-info {
  background: #fff;
  display:flex;
  align-items: center;
  height: 240px;
  padding: 0 40px;

  .left {
    display: flex;

    >.iconfont {
      font-size: 80px;
    }

    .red {
      color: $priceColor;
    }

    .green {
      color: #1dc779;
    }

    .tip {
      padding-left: 10px;
      flex: 1;
      margin-top: 20px;

      p {
        &:first-child {
          font-size: 20px;
          margin-bottom: 5px;
        }

        &:last-child {
          color: #999;
          font-size: 16px;
        }
      }
    }
  }

  .right {
    display: block;

    .amount {
      margin-top: 50px;
      margin-left: 85px;

      span {
        &:first-child {
          font-size: 16px;
          color: #999;
        }

        &:last-child {
          color: $priceColor;
          font-size: 20px;
        }
      }
    }

    .cancel-btn {
      margin-left: 85px;
      margin-top: 20px;
      display:block;
      background-color: $priceColor;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      transition: background-color 0.3s;

      &:hover {
        background-color: color.scale($priceColor, $lightness: -10%);
      }
    }
  }
}

.pay-type {
  margin-top: 20px;
  background-color: #fff;
  padding-bottom: 70px;

  p {
    line-height: 70px;
    height: 70px;
    padding-left: 30px;
    font-size: 16px;

    &.head {
      border-bottom: 1px solid #f5f5f5;
    }
  }

  .btn {
    width: 150px;
    height: 50px;
    border: 1px solid #e4e4e4;
    text-align: center;
    line-height: 48px;
    margin-left: 30px;
    color: #666666;
    display: inline-block;

    &.active,
    &:hover {
      border-color: $xtxColor;
    }

    &.alipay {
      background: url(https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/7b6b02396368c9314528c0bbd85a2e06.png) no-repeat center / contain;
    }

    &.wx {
      background: url(https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/c66f98cff8649bd5ba722c2e8067c6ca.jpg) no-repeat center / contain;
    }
  }
}
</style>
