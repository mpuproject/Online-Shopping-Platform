<script setup>
import { getSearchResultsAPI } from '@/apis/search';
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import GoodsItem from '../Home/components/GoodsItem.vue';

const route = useRoute()

// 获取搜索结果
const searchResults = ref([])
const requestData = ref({
  q: route.query.q, // 从路由中获取搜索关键词
  category: route.query.category,
  page: 1,
  pageSize: 10,
  sortField: 'created_time' // 默认按最新排序
})

const fetchSearchResults = async () => {
  const res = await getSearchResultsAPI(requestData.value)
  searchResults.value = res.data.products
}

onMounted(() => {
  fetchSearchResults()
  console.log(requestData.value)
})

// 监听路由的 query 参数变化
watch(
  () => route.query, // 监听 route.query
  (newQuery) => {
    // 更新 requestData 中的搜索参数
    requestData.value.q = newQuery.q
    requestData.value.category = newQuery.category
    requestData.value.page = 1 // 重置页码
    fetchSearchResults() // 重新获取搜索结果
  }
)

// tab切换回调
const tabChange = async () => {
  requestData.value.page = 1 // 重置页码
  const res = await getSearchResultsAPI(requestData.value)
  searchResults.value = res.data.products
}

// 分页加载更多
const disabled = ref(false)

const load = async () => {
  // 获取下一页数据
  requestData.value.page++
  const res = await getSearchResultsAPI(requestData.value)
  searchResults.value = [...searchResults.value, ...res.data.products]  // 合并新旧数据

  // 加载完毕，停止监听
  if(res.data.products.length === 0) {
    disabled.value = true
  }
}
</script>

<template>
  <div class="container">
    <!-- 面包屑 -->
    <div class="bread-container">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
        <el-breadcrumb-item>Search Results</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="sub-container">
      <el-tabs v-model="requestData.sortField" @tab-change="tabChange">
        <el-tab-pane label="Newest" name="created_time"></el-tab-pane>
        <el-tab-pane label="Hotest" name="product_rating"></el-tab-pane>
      </el-tabs>
      <div class="body" v-infinite-scroll="load" :infinite-scroll-disabled="disabled">
         <!-- 商品列表-->
         <GoodsItem v-for="good in searchResults" :goods="good" :key="good.id" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.bread-container {
  padding: 25px 0;
  color: #666;
}

.sub-container {
  padding: 20px 10px;
  background-color: #fff;

  .body {
    display: flex;
    flex-wrap: wrap;
    padding: 0 10px;
  }

  .goods-item {
    display: block;
    width: 220px;
    margin-right: 20px;
    padding: 20px 30px;
    text-align: center;

    img {
      width: 160px;
      height: 160px;
    }

    p {
      padding-top: 10px;
    }

    .name {
      font-size: 16px;
    }

    .desc {
      color: #999;
      height: 29px;
    }

    .price {
      color: $priceColor;
      font-size: 20px;
    }
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
</style>
