<script setup>
import HomePanel from './HomePanel.vue'
import { ref } from 'vue'
import GoodsItem from './GoodsItem.vue'

// 静态数据
const goodsProduct = ref([
  {
    id: 1,
    name: "Living",
    saleInfo: "Furniture",
    picture: "https://picsum.photos/200/600",
    goods: [
      { id: 101, name: "Comfort Sofa", price: 1999, images: "https://picsum.photos/200/200?random=1" },
      { id: 102, name: "Dining Table", price: 2499, images: "https://picsum.photos/200/200?random=2" },
      { id: 103, name: "Soft Matress", price: 999, images: "https://picsum.photos/200/200?random=3" },
      { id: 104, name: "Simple Shelf", price: 599, images: "https://picsum.photos/200/200?random=4" }
    ]
  },
  {
    id: 2,
    name: "Food",
    saleInfo: "Delicacies",
    picture: "https://picsum.photos/200/600",
    goods: [
      { id: 201, name: "Sirloin Steak", price: 199, images: "https://picsum.photos/200/200?random=6" },
      { id: 202, name: "Organic Vege", price: 29, images: "https://picsum.photos/200/200?random=7" },
      { id: 203, name: "Fresh Fruit", price: 39, images: "https://picsum.photos/200/200?random=8" },
      { id: 204, name: "Fine Red Wine", price: 299, images: "https://picsum.photos/200/200?random=9" }
    ]
  }
]);
</script>

<template>
  <div class="home-product">
    <HomePanel
      v-for="cate in goodsProduct"
      :key="cate.id"
      :title="cate.name"
    >
      <div class="box">
        <RouterLink class="cover" to="/">
          <img :src="cate.picture" alt="Category Image" />
          <strong class="label">
            <span>{{ cate.name }}</span>
            <span>{{ cate.saleInfo }}</span>
          </strong>
        </RouterLink>
        <ul class="goods-list">
          <li v-for="goods in cate.goods" :key="goods.id">
            <GoodsItem :goods="goods" />
          </li>
        </ul>
      </div>
    </HomePanel>
  </div>
</template>

<style scoped lang='scss'>
.home-product {
  background: #fff;
  margin-top: 20px;

  .sub {
    margin-bottom: 2px;

    a {
      padding: 2px 12px;
      font-size: 16px;
      border-radius: 4px;

      &:hover {
        background: $xtxColor;
        color: #fff;
      }

      &:last-child {
        margin-right: 80px;
      }
    }
  }

  .box {
    display: flex;

    .cover {
      width: 240px;
      height: 610px;
      margin-right: 10px;
      position: relative;

      img {
        width: 100%;
        height: 100%;
      }

      .label {
        width: 188px;
        height: 66px;
        display: flex;
        font-size: 18px;
        color: #fff;
        line-height: 66px;
        font-weight: normal;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translate3d(0, -50%, 0);

        span {
          text-align: center;

          &:first-child {
            width: 76px;
            background: rgba(0, 0, 0, 0.9);
          }

          &:last-child {
            flex: 1;
            background: rgba(0, 0, 0, 0.7);
          }
        }
      }
    }

    .goods-list {
      width: 990px;
      display: flex;
      flex-wrap: wrap;

      li {
        width: 240px;
        height: 300px;
        margin-right: 10px;
        margin-bottom: 10px;

        &:nth-last-child(-n + 4) {
          margin-bottom: 0;
        }

        &:nth-child(4n) {
          margin-right: 0;
        }
      }
    }
  }
}
</style>

