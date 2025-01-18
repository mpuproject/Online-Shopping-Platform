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
            <div class="category-select">
              <span class="selected">全部</span>
              <div class="dropdown-menu">
                <div class="dropdown-item">全部</div>
                <div class="dropdown-item">居家</div>
                <div class="dropdown-item">美食</div>
                <div class="dropdown-item">服饰</div>
              </div>
            </div>
            <div class="search">
              <input type="text" placeholder="搜一搜">
              <button class="search-button">
                <i class="iconfont icon-search"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Bar -->
    <div class="nav-section">
      <div class="container">
        <ul class="app-header-nav">
          <li class="home">
            <RouterLink to="/">首页</RouterLink>
          </li>
          <li>
            <RouterLink to="/">居家</RouterLink>
          </li>
          <li>
            <RouterLink to="/">美食</RouterLink>
          </li>
          <li>
            <RouterLink to="/">服饰</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

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
  width: 70px;
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
    left: -2px; // 对齐父元素border
    right: -1px; // 对齐右侧分隔线
    background: #fff;
    border: none;
    border-top: none;
    border-radius: 0 0 4px 4px;
    padding: 5px 0;
    display: none;
    animation: slideDown 0.5s ease-out;
    z-index: 100;
  }

  .dropdown-item {
    padding: 8px 10px;
    font-size: 14px;
    color: #666;
    
    &:hover {
      background-color: #f5f5f5;
      color: $xtxColor;
    }
  }

  &:hover {
    .dropdown-menu {
      display: block;
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
    
    &.home {
      a {
        font-weight: 500;
      }
    }
  }
}
</style>