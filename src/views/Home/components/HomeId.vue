<template>
  <div v-if="userStore.userInfo.username" class="profile-card">
    <div class="avatar">
      <img :src="avatarUrl" alt="profile" />
    </div>
    <div class="user-info">
      <h2>{{ userStore.userInfo.username }}</h2>
      <a>Switch</a>
      <span> | </span>
      <el-popconfirm @confirm="confirmLogout" title="Confirm logout?" confirm-button-text="Logout" cancel-button-text="Cancel">
        <template #reference>
          <a href="javascript:;">Logout</a>
        </template>
      </el-popconfirm>
    </div>
    <div class="stats">
      <a
        v-for="(item, index) in stats"
        :key="index"
        :href="item.link"
        class="stat-item"
      >
        <span class="iconfont" v-html="item.icon"></span>
        <span>{{ item.label }}</span>
      </a>
    </div>
    <div class="pending">
      <div class="pending-item">
        <span class="number">{{ pending.payment }}</span>
        <span class="label">待付款</span>
      </div>
      <div class="pending-item">
        <span class="number">{{ pending.received }}</span>
        <span class="label">待收货</span>
      </div>
      <div class="pending-item">
        <span class="number">{{ pending.review }}</span>
        <span class="label">待评价</span>
      </div>
      <div class="pending-item">
        <span class="number">{{ pending.returns }}</span>
        <span class="label">退换</span>
      </div>
    </div>
    
    <!-- Membership Cards -->
    <div class="membership-cards">
      <div class="card plus-member">
        <div class="card-content">
          <h3>PLUS</h3>
          <button class="activate-btn brown">立即开通</button>
        </div>
      </div>
      <div class="card enterprise-member">
        <div class="card-content">
          <h3>会员</h3>
          <button class="activate-btn blue">立即开通</button>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="profile-card-n">
    <div class="avatar">
      <img src="/src/assets/images/200.png" alt="" @click="$router.push({ path: '/login' })" />
      <div class="avatar-links">
        <a href="javascript:;" @click="$router.push({ path: '/register' })">Signup</a>
        <span> | </span>
        <a href="javascript:;">I'm a manager</a>
      </div>
    </div>
    <div class="user-info">
      <h2><a @click="$router.push({ path: '/login' })">You are currently logout</a></h2>
    </div>
    <el-button size="large" @click="$router.push({ path: '/login' })" class="loginBtn">Login</el-button>
  </div>
</template>

<script setup>
import 'element-plus/theme-chalk/el-message.css'
import { useUserStore } from '@/stores/user';

const userStore = useUserStore()

const confirmLogout = () => {
  userStore.clearUserInfo()
}

const avatarUrl = userStore.userInfo.profile;
const stats = [
  { icon: '&#x10186;', label: '收藏', link: '#/favorites' },
  { icon: '&#x10187;', label: '购物车', link: '#/cart' },
  { icon: '&#x10188;', label: '消息', link: '#/messages' },
  { icon: '&#x10189;', label: '订单', link: '#/orders' }
]
const pending = {
  payment: 0, received: 0, review: 12, returns: 0
}
</script>

<style scoped lang="scss">
@font-face {
  font-family: 'iconfont'; /* Project id 3373080 */
  src: url('//at.alicdn.com/t/font_3373080_mefuod36dv.woff2?t=1651511952500') format('woff2'),
       url('//at.alicdn.com/t/font_3373080_mefuod36dv.woff?t=1651511952500') format('woff'),
       url('//at.alicdn.com/t/font_3373080_mefuod36dv.ttf?t=1651511952500') format('truetype');
}

/* 定义使用iconfont的样式 */
.iconfont {
  font-family: "iconfont" !important;
  font-size: 24px; /* Increased from 16px */
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;
  transition: color 0.3s; /* 添加过渡效果 */
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #333;
  gap: 8px; /* Added gap between icon and label */
}

.stat-item:hover {
  color: $xtxColor; /* 替换为你想要的颜色 */
}

.profile-card {
  border: 1px solid #eaeaea;
  border-radius: 10px;
  padding: 20px;
  width: 250px;
  text-align: center;
  background-color: #fff;

  div.avatar img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }

  div.user-info h2 {
    margin: 10px 0;
    font-size: 18px;
  }

  div.user-info a {
    margin: 5px 0;
    font-size: 14px;
  }
}

.profile-card-n {
  border: 1px solid #eaeaea;
  border-radius: 10px;
  padding: 20px;
  width: 250px;
  background-color: #fff;

  div.avatar {
    position: relative;
    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }
    .avatar-links {
      position: absolute;
      bottom: 0px; /* 调整位置，使其在头像下方 */
      right: 0;
      display: flex;
      align-items: center; /* 垂直居中 */
      font-size: 12px;
      color: #666;
      a {
        color: #666;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
          color: $xtxColor;
        }
      }
      span {
        margin: 0 4px; /* 调整分隔符的间距 */
        color: #666; /* 分隔符颜色 */
      }
    }
  }

  div.user-info h2 {
    text-align: center;
    margin: 10px 0;
    font-size: 18px;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  div.user-info a {
    margin: 5px 0;
    font-size: 14px;
  }
}

.stats {
  display: flex;
  justify-content: space-around;
  margin: 20px 0 25px; /* Adjusted margins */
  padding: 0 10px; /* Added padding */
}

.pending {
  display: flex;
  justify-content: space-between;
  padding: 15px 10px; /* Adjusted padding */
  background: #f5f5f5;
  border-radius: 8px;
  margin: 15px 0;

  .pending-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    gap: 6px; /* Added consistent gap */

    .number {
      font-size: 24px;
      font-weight: bold;
      line-height: 1;
    }

    .label {
      font-size: 13px; /* Slightly increased for better readability */
      color: #666;
    }
  }
  .pending-item:not(:last-child)::after {
      content: '';
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      height: 80%;
      width: 1px;
      background-color: #e4e4e4;
    }
}

.membership-cards {
  display: flex;
  gap: 10px;
  margin-top: 20px;

  .card {
    flex: 1;
    border-radius: 8px;
    padding: 15px;
    color: #fff;

    &.plus-member {
      background: linear-gradient(to right, #e6c48c, #d4af6f);
    }

    &.enterprise-member {
      background: linear-gradient(to right, #7aa5eb, #5785e0);
    }

    .card-content {
      h3 {
        font-size: 16px;
        margin: 0 0 5px 0;
      }

      p {
        font-size: 12px;
        margin: 0 0 10px 0;
        opacity: 0.9;
      }

      .activate-btn {
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        
        &.brown {
          background: #8b6d42;
          color: #fff;
        }

        &.blue {
          background: #3668d1;
          color: #fff;
        }

        &:hover {
          opacity: 0.9;
        }
      }
    }
  }
}

.loginBtn {
  background: $xtxColor;
  width: 100%;
  color: #fff;
}
</style>

