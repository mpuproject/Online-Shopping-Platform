<template>
  <header class='app-header'>
    <div class="main-header">
      <div class="container">
        <!-- Logo -->
        <h1 class="logo">
          <RouterLink to="/">Rabbuy</RouterLink>
        </h1>

        <!-- Search Bar -->
        <div class="search-section">
          <div class="search-wrapper">
            <div class="category-select"
              @mouseenter="openDropdown" @mouseleave="closeDropdown"
            >
              <span class="selected">{{ selectedCategory }}</span>
              <div class="dropdown-menu" v-show="isDropdownVisible">
                <div class="dropdown-item" @click="selectCategory('All')">All</div>
                <div class="dropdown-item" @click="selectCategory(c.name)" v-for="c in categoryList" :key="c.id">{{ c.name }}</div>
              </div>
            </div>
            <div class="search">
              <input type="text" placeholder="Search Rabbuy">
              <button class="search-button">
                <i class="iconfont icon-search"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Cart Icon -->
        <div class="cart-icon" @click="openCart">
          <i class="iconfont icon-cart cart-icon-large"></i>
          <span class="cart-badge" v-if="cartItemCount > 0">{{ cartItemCount }}</span>
        </div>
      </div>
    </div>
  </header>
  <SlidingCart ref="slidingCartRef" />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import SlidingCart from '@/views/Home/components/SlidingCart.vue'

const cartStore = useCartStore()

const selectedCategory = ref('All')
const isDropdownVisible = ref(false)
const cartItemCount = computed(() => cartStore.totalCount)
const slidingCartRef = ref(null)

const openDropdown = () => {
  isDropdownVisible.value = true
}

const closeDropdown = () => {
  isDropdownVisible.value = false
}

const selectCategory = (category) => {
  selectedCategory.value = category;
  isDropdownVisible.value = false;
}

const categoryList = [
  { id: 'living', name: 'Living' },
  { id: 'food', name: 'Food' },
  { id: 'clothes', name: 'Clothes' },
  { id: 'baby', name: 'Baby' },
  { id: 'health', name: 'Health' },
  { id: 'Digital', name: 'Digital' },
  { id: 'sports', name: 'Sports' }
]

const openCart = () => {
  slidingCartRef.value?.toggleCart()
}
</script>

<style scoped lang='scss'>
.app-header {
  background: #fff;
}

.main-header {
  border-bottom: 1px solid #e7e7e7;

  .container {
    display: flex;
    align-items: center;
    height: 80px;
  }
}

.logo {
  margin-top: 10px;
  width: 200px;

  a {
    display: block;
    height: 132px;
    width: 100%;
    text-indent: -9999px;
    background: url('@/assets/images/logo.png') no-repeat center 18px / contain;
  }
}

.search-section {
  flex: 1;
  padding: 0 20px;
  max-width: 800px;
}

.search-wrapper {
  display: flex;
  width: 100%;
  height: 40px;
  border: 2px solid $xtxColor;
  border-radius: 4px;
  margin-left: 49px;
}

.category-select {
  position: relative;
  min-width: 70px;
  border-right: 1px solid #e7e7e7;
  background-color: #f5f5f5;
  cursor: pointer;

  .selected {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 10px;
    font-size: 14px;
    color: #666;
    white-space: nowrap;

    &::after {
      content: '';
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 5px 5px 0 5px;
      border-color: #666 transparent transparent transparent;
      margin-left: 8px;
    }
  }

  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: -2px;
    right: -1px;
    background: #fff;
    border: 1px solid #e7e7e7;
    border-top: none;
    border-radius: 0 0 4px 4px;
    padding: 5px 0;
    z-index: 100;
    min-width: 100%;
  }

  .dropdown-item {
    padding: 8px 10px;
    font-size: 14px;
    color: #666;
    white-space: nowrap;

    &:hover {
      background-color: #f5f5f5;
      color: $xtxColor;
    }
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search {
  flex: 1;
  display: flex;
  align-items: center;
  margin-left: 5px;

  input {
    flex: 1;
    width: 100%;
    height: 100%;
    border: none;
    font-size: 14px;

    &:focus {
      outline: none;
    }
  }

  .search-button {
    border: none;
    background-color: $xtxColor;
    color: #fff;
    width: 70px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-left: -2px;

    .icon-search {
      font-size: 18px;
    }
  }
}

.cart-icon {
  position: relative;
  cursor: pointer;
  font-size: 24px;
  color: #666;
  transition: color 0.3s;
  margin-left: 190px;

  &:hover {
    color: $xtxColor;
  }

  .cart-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background-color: #ff6b6b;
    color: white;
    border-radius: 50%;
    font-size: 12px;
    width: 18px;
    height: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .cart-icon-large {
    font-size: 24px;
  }
}
</style>

