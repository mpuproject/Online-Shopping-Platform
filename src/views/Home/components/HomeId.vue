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
      <span>待付款: {{ pending.payment }}</span>
      <span>待收货: {{ pending.received }}</span>
      <span>待评价: {{ pending.review }}</span>
      <span>退换货: {{ pending.returns }}</span>
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

const avatarUrl = "https://cdn.pixabay.com/photo/2016/08/11/23/48/mountains-1587287_1280.jpg";
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
  font-size: 16px;
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
  margin: 15px 0;
}

.pending {
  margin-top: 10px;
  font-size: 14px;
  color: #333;
}

.loginBtn {
  background: $xtxColor;
  width: 100%;
  color: #fff;
}
</style>
