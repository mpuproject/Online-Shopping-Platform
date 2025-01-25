<template>
  <header class='app-header'>
    <div class="main-header">
      <div class="container">
        <!-- Logo -->
        <h1 class="logo">
          <RouterLink to="/manager">Rabbuy admin</RouterLink>
        </h1>

        <!-- Search Bar -->
        <div class="search-section">
          <div class="search-wrapper">
            <div class="search">
              <input type="text" placeholder="Search">
              <button class="search-button">
                <i class="iconfont icon-search"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
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
</style>

