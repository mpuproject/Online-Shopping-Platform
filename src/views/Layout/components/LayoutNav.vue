<script setup>
import { ref } from 'vue'

const categories = ref([
  { id: 'living', name: '居家' },
  { id: 'food', name: '美食' },
  { id: 'clothes', name: '服饰' },
])
</script>

<template>
  <!-- Navigation Bar -->
  <div class="nav-section">
    <div class="container">
      <ul class="app-header-nav">
        <li class="home">
          <RouterLink to="/" active-class="active">首页</RouterLink>
        </li>
        <li v-for="category in categories" :key="category.id">
          <RouterLink :to="`/category/${category.id}`" active-class="active">{{ category.name }}</RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nav-section {
  background: #f5f5f5;
  border-bottom: 1px solid #e7e7e7;
}

.app-header-nav {
  height: 40px;
  display: flex;
  align-items: center;
  padding-left: 40px;

  li {
    margin-right: 40px;

    a {
      font-size: 14px;
      line-height: 40px;
      display: inline-block;

      &:hover {
        color: $xtxColor;
      }
    }

    .active {
      color: $xtxColor;
      border-bottom: 1px solid $xtxColor;
    }

    &.home {
      a {
        font-weight: 500;
      }
    }
  }
}
</style>

