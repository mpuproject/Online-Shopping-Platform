<script setup>
import HomePanel from './HomePanel.vue'
import { ref } from 'vue'
import GoodsItem from './GoodsItem.vue'

// 静态数据
const goodsProduct = ref([
  {
    id: 1,
    name: "居家",
    saleInfo: "家具生活",
    picture: "https://picsum.photos/200/600",
    goods: [
      { id: 101, name: "舒适沙发", price: 1999, picture: "https://picsum.photos/200/200?random=1" },
      { id: 102, name: "实木餐桌", price: 2499, picture: "https://picsum.photos/200/200?random=2" },
      { id: 103, name: "柔软床垫", price: 999, picture: "https://picsum.photos/200/200?random=3" },
      { id: 104, name: "简约书架", price: 599, picture: "https://picsum.photos/200/200?random=4" }
    ]
  },
  {
    id: 2,
    name: "美食",
    saleInfo: "品质美味",
    picture: "https://picsum.photos/200/600",
    goods: [
      { id: 201, name: "进口牛排", price: 199, picture: "https://picsum.photos/200/200?random=6" },
      { id: 202, name: "有机蔬菜", price: 29, picture: "https://picsum.photos/200/200?random=7" },
      { id: 203, name: "新鲜水果", price: 39, picture: "https://picsum.photos/200/200?random=8" },
      { id: 204, name: "高级红酒", price: 299, picture: "https://picsum.photos/200/200?random=9" }
    ]
  }
]);
</script>
<!-- 
<template>
  <div class="home-product">
    <HomePanel :title="cate.name" v-for="cate in goodsProduct" :key="cate.id">
      <div class="box">
        <RouterLink class="cover" to="/">
          <img v-img-lazy="cate.picture" />
          <strong class="label">
            <span>{{ cate.name }}馆</span>
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
</template> -->

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
            <span>{{ cate.name }}馆</span>
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

