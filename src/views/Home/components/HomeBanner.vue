<script setup>
import { ref } from 'vue';

const bannerList = ref([
  { id: 1, imgUrl: 'https://cdn.pixabay.com/photo/2016/08/11/23/48/mountains-1587287_1280.jpg' },
  { id: 2, imgUrl: 'https://cdn.pixabay.com/photo/2016/11/14/04/45/elephant-1822636_1280.jpg' },
  { id: 3, imgUrl: 'https://cdn.pixabay.com/photo/2017/05/09/03/46/alberta-2297204_1280.jpg' },
  // 添加更多静态图片的链接
]);
</script>

<template>
  <div class="home-banner">
    <el-carousel height="500px">
      <el-carousel-item v-for="item in bannerList" :key="item.id">
        <img :src="item.imgUrl" alt="" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<style scoped lang="scss">
.home-banner {
  width: 700px;
  height: 500px;
  position: relative; /* 保持相对定位 */
  margin: 0 auto; /* 居中显示 */
  z-index: 98;
  border-top-right-radius: 10px; 
  border-bottom-right-radius: 10px; 
  overflow: hidden; /* 确保超出部分被裁剪 */

  img {
    width: 100%;
    height: 100%; /* 修改为 100% 以适应容器 */
    object-fit: cover; 
    border-top-right-radius: 10px; 
    border-bottom-right-radius: 10px; 
  }
}
</style>