<script setup>
import GoodsItem from '../Home/components/GoodsItem.vue' 
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const bannerList = ref([
  { id: 1, imgUrl: 'https://picsum.photos/1200/500.jpg?random=4' },
  { id: 2, imgUrl: 'https://picsum.photos/1200/500.jpg?random=5' },
  { id: 3, imgUrl: 'https://picsum.photos/1200/500.jpg?random=6' },
])

const categoryData = ref({
  name: '',
  children: []
})

const fetchCategoryData = async (id) => {
  // Simulating API call
  const categories = {
    living: {
      name: '居家',
      children: [
        {
          id: 1,
          name: '家具',
          picture: 'https://picsum.photos/350/350.jpg?random=3',
          goods: [
            { id: 101, name: 'Sofa', price: 999, picture: 'https://picsum.photos/500/500.jpg?random=7' },
            { id: 102, name: 'Dining Table', price: 599, picture: 'https://picsum.photos/500/500.jpg?random=8' },
          ]
        },
        {
          id: 2,
          name: '家纺',
          picture: 'https://picsum.photos/350/350.jpg?random=2',
          goods: [
            { id: 201, name: 'Bedding Set', price: 199, picture: 'https://picsum.photos/500/500.jpg?random=9' },
            { id: 202, name: 'Curtains', price: 99, picture: 'https://picsum.photos/500/500.jpg?random=10' },
          ]
        },
      ]
    },
    food: {
      name: '美食',
      children: [
        {
          id: 1,
          name: '零食',
          picture: 'https://picsum.photos/350/350.jpg?random=2',
          goods: [
            { id: 101, name: 'Chips', price: 5, picture: 'https://picsum.photos/500/500.jpg?random=11' },
            { id: 102, name: 'Cookies', price: 8, picture: 'https://picsum.photos/500/500.jpg?random=12' },
          ]
        },
        {
          id: 2,
          name: '饮料',
          picture: 'https://picsum.photos/350/350.jpg?random=4',
          goods: [
            { id: 201, name: 'Soda', price: 3, picture: 'https://picsum.photos/500/500.jpg?random=13' },
            { id: 202, name: 'Juice', price: 4, picture: 'https://picsum.photos/500/500.jpg?random=14' },
          ]
        },
      ]
    },
    clothes: {
      name: '服饰',
      children: [
        {
          id: 1,
          name: '上衣',
          picture: 'https://picsum.photos/350/350.jpg?random=5',
          goods: [
            { id: 101, name: 'T-Shirt', price: 29, picture: 'https://picsum.photos/500/500.jpg?random=15' },
            { id: 102, name: 'Sweater', price: 59, picture: 'https://picsum.photos/500/500.jpg?random=16' },
          ]
        },
        {
          id: 2,
          name: '裤子',
          picture: 'https://picsum.photos/350/350.jpg?random=6',
          goods: [
            { id: 201, name: 'Jeans', price: 79, picture: 'https://picsum.photos/500/500.jpg?random=17' },
            { id: 202, name: 'Shorts', price: 39, picture: 'https://picsum.photos/500/500.jpg?random=18' },
          ]
        },
      ]
    },
  }

  categoryData.value = categories[id] || { name: 'Category Not Found', children: [] }
}

onMounted(() => {
  fetchCategoryData(route.params.id)
})

watch(() => route.params.id, (newId) => {
  fetchCategoryData(newId)
})
</script>

<template>
  <div class="top-category">
    <div class="container m-top-20">
      <!-- Breadcrumb -->
      <div class="bread-container">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ categoryData.name }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- Carousel -->
      <div class="home-banner">
        <el-carousel height="500px">
          <el-carousel-item v-for="item in bannerList" :key="item.id">
            <img :src="item.imgUrl" alt="">
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="sub-list">
        <h3>全部分类</h3>
        <ul>
          <li v-for="i in categoryData.children" :key="i.id">
            <RouterLink :to="`/category/sub/${i.id}`">
              <img :src="i.picture" />
              <p>{{ i.name }}</p>
            </RouterLink>
          </li>
        </ul>
      </div>
      <div class="ref-goods" v-for="item in categoryData.children" :key="item.id">
        <div class="head">
          <h3>- {{ item.name }} -</h3>
        </div>
        <div class="body">
          <GoodsItem v-for="good in item.goods" :goods="good" :key="good.id" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.top-category {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }

  .sub-list {
    margin-top: 20px;
    background-color: #fff;

    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;

      li {
        width: 168px;
        height: 160px;

        a {
          text-align: center;
          display: block;
          font-size: 16px;

          img {
            width: 100px;
            height: 100px;
          }

          p {
            line-height: 40px;
          }

          &:hover {
            color: $xtxColor;
          }
        }
      }
    }
  }

  .ref-goods {
    background-color: #fff;
    margin-top: 20px;
    position: relative;

    .head {
      .xtx-more {
        position: absolute;
        top: 20px;
        right: 20px;
      }

      .tag {
        text-align: center;
        color: #999;
        font-size: 20px;
        position: relative;
        top: -20px;
      }
    }

    .body {
      display: flex;
      justify-content: space-around;
      padding: 0 40px 30px;
    }
  }

  .bread-container {
    padding: 25px 0;
  }
}

.home-banner {
  width: 1240px;
  height: 500px;
  margin: 0 auto;

  img {
    width: 100%;
    height: 500px;
  }
}
</style>

