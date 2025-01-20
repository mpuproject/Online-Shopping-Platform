<script setup>
import HomePanel from './HomePanel.vue'
import { ref } from 'vue'

// Static data
const hotList = ref([
  {
    id: 1,
    title: "热门商品1",
    alt: "畅销爆款",
    picture: "https://picsum.photos/300/300?random=6.jpg"
  },
  {
    id: 2,
    title: "热门商品2",
    alt: "人气推荐",
    picture: "https://picsum.photos/300/300?random=7.jpg"
  },
  {
    id: 3,
    title: "热门商品3",
    alt: "限时特惠",
    picture: "https://picsum.photos/300/300?random=8.jpg"
  },
  {
    id: 4,
    title: "热门商品4",
    alt: "优质精选",
    picture: "https://picsum.photos/300/300?random=9.jpg"
  }
])
</script>

<template>
  <HomePanel title="Hot" sub-title="Too pop to miss">
    <ul class="goods-list">
      <li v-for="item in hotList" :key="item.id">
        <RouterLink to="/">
          <img :src="item.picture" alt="" />
          <p class="name">{{ item.title }}</p>
          <p class="desc">{{ item.alt }}</p>
        </RouterLink>
      </li>
    </ul>
  </HomePanel>
</template>

<style scoped lang='scss'>
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 426px;

  li {
    width: 306px;
    height: 406px;
    transition: all .5s;

    &:hover {
      transform: translate3d(0, -3px, 0);
      box-shadow: 0 3px 8px rgb(0 0 0 / 20%);
    }

    img {
      width: 306px;
      height: 306px;
    }

    p {
      font-size: 22px;
      padding-top: 12px;
      text-align: center;
    }

    .desc {
      color: #999;
      font-size: 18px;
    }
  }
}
</style>

