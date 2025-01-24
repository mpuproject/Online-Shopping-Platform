<script setup>
import ImageView from '@/components/ImageView/index.vue';
import { getDetailAPI } from '@/apis/detail';
import { ref, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import { useCartStore } from '@/stores/cartStore';

const product = ref({});
const route = useRoute();;

const getDetail = async () => {
  const res = await getDetailAPI(route.params.id);
  product.value = res.data;
};

onBeforeMount(() => {
  getDetail();
});

// 选择商品数量
const cartStore = useCartStore()
const count = ref(1)
const handleChange = (num) => {
  count.value = num
  console.log(count.value)
}

const addCart = () => {
  cartStore.addToCart({
    id: product.value.id,
    name: product.value.name,
    image: product.value.images[0],
    price: product.value.price,
    count: count.value,
    selected: true,
  })
}
</script>

<template>
  <div class="xtx-goods-page">
    <div class="container">
      <div class="bread-container">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: `/category/${product.category?.id}` }">
            {{ product.category?.name }}
          </el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: `/category/sub/${product.sub_category?.id}` }">
            {{ product.sub_category?.name }}
          </el-breadcrumb-item>
          <el-breadcrumb-item>{{ product.name }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 商品信息 -->
      <div class="info-container">
        <div>
          <div class="goods-info">
            <div class="media">
              <!-- 图片预览区 -->
              <template v-if="product.images && product.images.length > 0">
                <ImageView :imageList="product.images" />
              </template>
              <!-- 统计数量 -->
              <ul class="goods-sales">
                <li>
                  <p>Sales</p>
                  <p>100+</p>
                  <p><i class="iconfont icon-task-filling"></i>Sales</p>
                </li>
                <li>
                  <p>Comment</p>
                  <p>200+</p>
                  <p><i class="iconfont icon-comment-filling"></i>Check</p>
                </li>
                <li>
                  <p>Favorite</p>
                  <p>300+</p>
                  <p><i class="iconfont icon-favorite-filling"></i>Add</p>
                </li>
                <li>
                  <p>Brand Info</p>
                  <p>400+</p>
                  <p><i class="iconfont icon-dynamic-filling"></i>Pages</p>
                </li>
              </ul>
            </div>
            <div class="spec">
              <!-- 商品信息区 -->
              <p class="g-name">{{ product.name }}</p>
              <p class="g-desc">{{ product.description }}</p>
              <p class="g-price"> Price: &nbsp;
                <span>{{ product.price }}</span>
              </p>
              <p class="g-inventory">
                Inventory:
                <span v-if="product.stock_quantity <= product.low_stock_threshold" class="low-stock">
                  {{ product.stock_quantity }} only
                </span>
                <span v-else>{{ product.stock_quantity }}</span>
              </p>
              <div class="g-service">
                <dl>
                  <dt>On-Sale:</dt>
                  <dd>Voucher purchases go straight down to 120 yuan</dd>
                </dl>
                <dl>
                  <dt>Service</dt>
                  <dd>
                    <span>Sales Return</span>
                    <span>Refunding</span>
                    <span>Free Shipping</span>
                    <a href="javascript:;">Details...</a>
                  </dd>
                </dl>
              </div>
              <!-- sku组件 -->

              <!-- 数据组件 -->
              <p class="g-quantity">Quantity: &nbsp;
                <el-input-number v-model="count" :min="1" :max="10" @change="handleChange" />
              </p>
              <!-- 按钮组件 -->
              <div>
                <el-button size="large" class="btn" @click="addCart">Add to cart</el-button>
              </div>
            </div>
          </div>
          <div class="goods-footer">
            <div class="goods-article">
              <!-- 商品详情 -->
              <div class="goods-tabs">
                <nav>
                  <a>Details</a>
                </nav>
                <div class="goods-detail">
                  <!-- 属性 -->
                  <ul class="attrs">
                    <li v-for="(value, key) in product.details" :key="key">
                      <span class="dt">{{ key.charAt(0).toUpperCase() + key.slice(1) }}:</span>
                      <span class="dd">{{ value }}</span>
                    </li>
                  </ul>
                  <!-- 评论 -->
                </div>
              </div>
            </div>
            <!-- 24热榜+专题推荐 -->
            <div class="goods-aside"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.xtx-goods-page {
  .goods-info {
    min-height: 600px;
    background: #fff;
    display: flex;

    .media {
      width: 580px;
      height: 600px;
      padding: 30px 50px;
    }

    .spec {
      flex: 1;
      padding: 30px 30px 30px 0;
    }
  }

  .goods-footer {
    display: flex;
    margin-top: 20px;

    .goods-article {
      width: 940px;
      margin-right: 20px;
    }

    .goods-aside {
      width: 280px;
      min-height: 1000px;
    }
  }

  .goods-tabs {
    min-height: 600px;
    background: #fff;
  }

  .goods-warn {
    min-height: 600px;
    background: #fff;
    margin-top: 20px;
  }

  .number-box {
    display: flex;
    align-items: center;

    .label {
      width: 60px;
      color: #999;
      padding-left: 10px;
    }
  }

  .g-name {
    font-size: 22px;
  }

  .g-desc {
    color: #999;
    margin-top: 10px;
  }

  .g-price {
    margin-top: 10px;
    font-size: 16px;

    span {
      color: $priceColor;
      margin-right: 10px;
      font-size: 20px;

      &::before {
        content: "¥";
        font-size: 18px;
      }
    }
  }

  .g-inventory {
    margin-top: 10px;
    font-size: 16px;

    .low-stock {
      color: #f33c3c;
    }
  }

  .g-service {
    background: #f5f5f5;
    width: 500px;
    padding: 20px 10px 0 10px;
    margin-top: 10px;

    dl {
      padding-bottom: 20px;
      display: flex;
      align-items: center;

      dt {
        width: 70px;
        color: #999;
      }

      dd {
        color: #666;

        &:last-child {
          span {
            margin-right: 10px;

            &::before {
              content: " • ";
              color: $xtxColor;
              margin-right: 2px;
            }
          }

          a {
            margin-left: 10px;
            color: $xtxColor;
          }
        }
      }
    }
  }

  .g-quantity{
    margin-top: 30px;
    font-size: 14px;
  }

  .goods-sales {
    display: flex;
    width: 400px;
    align-items: center;
    text-align: center;
    height: 140px;

    li {
      flex: 1;
      position: relative;

      ~li::after {
        position: absolute;
        top: 10px;
        left: 0;
        height: 60px;
        border-left: 1px solid #e4e4e4;
        content: "";
      }

      p {
        &:first-child {
          color: #999;
        }

        &:nth-child(2) {
          color: $priceColor;
          margin-top: 10px;
        }

        &:last-child {
          color: #666;
          margin-top: 10px;

          i {
            color: $xtxColor;
            font-size: 14px;
            margin-right: 2px;
          }

          &:hover {
            color: $xtxColor;
            cursor: pointer;
          }
        }
      }
    }
  }
}

.goods-tabs {
  min-height: 600px;
  background: #fff;

  nav {
    height: 70px;
    line-height: 70px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;

    a {
      padding: 0 40px;
      font-size: 18px;
      position: relative;

      >span {
        color: $priceColor;
        font-size: 16px;
        margin-left: 10px;
      }
    }
  }
}

.goods-detail {
  padding: 40px;

  .attrs {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 30px;

    li {
      display: flex;
      margin-bottom: 10px;
      width: 50%;

      .dt {
        width: 100px;
        color: #999;
      }

      .dd {
        flex: 1;
        color: #666;
      }
    }
  }

  >img {
    width: 100%;
  }
}

.btn {
  margin-top: 30px;
  background-color: $xtxColor;
  color: #fff;
}

.bread-container {
  padding: 25px 0;
}
</style>
