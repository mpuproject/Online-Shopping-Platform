<script setup>
import HomePanel from './HomePanel.vue'
import { ref } from 'vue'

// Static data
const newList = ref([
  {
    id: 1,
    name: "新鲜水果1",
    price: 29.99,
    picture: "https://picsum.photos/300/300.jpg"
  },
  {
    id: 2,
    name: "新鲜蔬菜2",
    price: 19.99,
    picture: "https://picsum.photos/300/300?random=1.jpg"
  },
  {
    id: 3,
    name: "新鲜肉类3",
    price: 39.99,
    picture: "https://picsum.photos/300/300?random=5.jpg"
  },
  {
    id: 4,
    name: "新鲜海鲜4",
    price: 49.99,
    picture: "https://picsum.photos/300/300?random=9.jpg"
  }
])
</script>

<template>
  <HomePanel title="新鲜好物" sub-title="新鲜出炉 品质靠谱">
    <ul class="goods-list">
      <li v-for="item in newList" :key="item.id">
        <RouterLink :to="`/detail/${item.id}`">
          <img :src="item.picture" alt="" />
          <p class="name">{{ item.name }}</p>
          <p class="price">&yen;{{ item.price }}</p>
        </RouterLink>
      </li>
    </ul>
  </HomePanel>
</template>

<style scoped lang='scss'>
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;

  li {
    width: 306px;
    height: 406px;

    background: #f0f9f4;
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
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    .price {
      color: $priceColor;
    }
  }
}
</style>

