<script setup>
import { computed } from 'vue';

const props = defineProps({
  goods: {
    type: Object,
    default: () => ({
      id: '',
      name: '',
      desc: '',
      price: 0,
      images: []
    })
  }
});

const imageUrl = computed(() => {
  return Array.isArray(props.goods.images) ? props.goods.images[0] : props.goods.images;
});
</script>

<template>
  <a :href="`/product/${goods.id}`" target="_blank" class="goods-item">
    <img :src="imageUrl" :alt="goods.name" />
    <p class="name ellipsis">{{ goods.name }}</p>
    <p class="desc ellipsis">{{ goods.desc }}</p>
    <p class="price">&yen;{{ goods.price }}</p>
  </a>
</template>

<style lang="scss" scoped>
.goods-item {
  display: block;
  width: 220px;
  padding: 20px 30px;
  text-align: center;
  transition: all .5s;

  &:hover {
    transform: translate3d(0, -3px, 0);
    box-shadow: 0 3px 8px rgb(0 0 0 / 20%);
  }

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

.ellipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>

