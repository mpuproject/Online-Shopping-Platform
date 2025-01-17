<template>
  <div class="profile-card">
    <div class="avatar">
      <img :src="avatarUrl" alt="头像" />
    </div>
    <div class="user-info">
      <h2>{{ userName }}</h2>
      <p>切换账号 | 退出</p>
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
</template>

<script>
export default {
  data() {
    return {
      avatarUrl: 'https://cdn.pixabay.com/photo/2016/08/11/23/48/mountains-1587287_1280.jpg', // 替换为头像路径
      userName: '玫瑰花恋上了蝴蝶',
      stats: [
        { icon: '&#x10186;', label: '收藏', link: '#/favorites' },
        { icon: '&#x10187;', label: '购物车', link: '#/cart' },
        { icon: '&#x10188;', label: '消息', link: '#/messages' },
        { icon: '&#x10189;', label: '订单', link: '#/orders' }
      ],
      pending: {
        payment: 0,
        received: 0,
        review: 12,
        returns: 0
      }
    };
  }
};
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
}

.avatar img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.user-info h2 {
  margin: 10px 0;
  font-size: 18px;
}

.user-info p {
  margin: 5px 0;
  font-size: 14px;
  color: #888;
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
</style>