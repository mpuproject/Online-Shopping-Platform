<script setup>
import { getSubcategoryFilterAPI, getSubcategoryProductAPI } from '@/apis/subcategory';
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import GoodsItem from '../Home/components/GoodsItem.vue';

const route = useRoute()

// 获取并组装二级分类下的导航信息
const subcategory = ref({})

const fetchSubcategoryFilterData = async (id) => {
  const res = await getSubcategoryFilterAPI(id)
  subcategory.value = res.data;
}

onMounted(() => {
  fetchSubcategoryFilterData(route.params.id)
})

// 获取并组装二级分类下的产品信息
const productList = ref([])
const requestData = ref({
  subCategoryId: route.params.id,
  page: 1,
  pageSize: 20,
  sortField: 'created_time'
})

const getProductList = async () => {
  const res = await getSubcategoryProductAPI(requestData.value)
  productList.value = res.data.products
}

onMounted(() => { getProductList() })

// tab切换回调
const tabChange = async () => {
  const res = await getSubcategoryProductAPI(requestData.value)
  productList.value = res.data.products
}

// 分页拼接
const disabled = ref(false)

const load = async () => {
  // 获取下一页数据
  requestData.value.page++
  const res = await getSubcategoryProductAPI(requestData.value)
  productList.value = [...productList.value, ...res.data.products]  // [老数组，新数组]

  // 加载完毕，停止监听
  if(res.data.products.length === 0) {
    disabled.value = true
  }
}

</script>

<template>
  <div class="container ">
    <!-- 面包屑 -->
    <div class="bread-container">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: `/category/${subcategory.categoryId}` }">{{ subcategory.categoryName }}
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{ subcategory.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="sub-container">
      <el-tabs v-model="requestData.sortField" @tab-change="tabChange">
        <el-tab-pane label="Newest" name="created_time"></el-tab-pane>
        <el-tab-pane label="Hotest" name="product_rating"></el-tab-pane>
      </el-tabs>
      <div class="body" v-infinite-scroll="load" :infinite-scroll-disabled="disabled">
         <!-- 商品列表-->
         <GoodsItem v-for="good in productList" :goods="good" :key="good.id" />
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
