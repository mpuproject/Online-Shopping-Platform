<script setup>
import { getCommentAPI } from '@/apis/comment';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()

const comment = ref({})

const getComment = async () => {
  const res = await getCommentAPI(route.params.id)
  comment.value = res.data
}

onMounted(() => {
  getComment()
})
</script>

<template>
  <div class="comment-container">
    <h2>Comment Review</h2>
    <div class="comment-wrapper">
      <div class="left">
        <img :src="comment.orderItem?.image" alt="Product Image" />
        <p>{{ comment.orderItem?.name }}</p>
      </div>
      <div class="right">
        <div class="rating-section">
          <span>Rating: </span>
          <el-rate
            v-model="comment.rating"
            disabled
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
            show-text
            text-color="#ff9900"
            :texts="['Very Bad', 'Bad', 'Good', 'Very Good', 'Excellent']"
          />
        </div>
        <el-input
          type="textarea"
          v-model="comment.commentDesc"
          readonly
          :rows="5"
        />
        <div class="photo-upload" v-if="comment.images && comment.images.length > 0">
          <div class="image-grid">
            <el-image
              v-for="(img, index) in comment.images"
              :key="index"
              :src="img"
              class="comment-image"
              :preview-src-list="comment.images"
              fit="cover"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="button-container">
      <el-button type="default" @click="$router.push('/order')">Back to Orders</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.comment-container {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  max-width: 1000px;
  margin: auto;
  margin-top: 50px;
  margin-bottom: 50px;

  h2 {
    margin-left: 20px;
  }

  .comment-wrapper {
    display: flex;
    gap: 30px;

    .left {
      width: 200px;
      text-align: center;

      img {
        width: 150px;
        height: 150px;
        margin-bottom: 10px;
      }

      p {
        font-size: 16px;
        margin-top: 5px;
      }
    }

    .right {
      flex: 1;
      margin-right: 20px;

      .rating-section {
        margin-bottom: 20px;
        display: flex;
        align-items: center;

        span {
          margin-right: 10px;
          font-size: 14px;
          color: #666;
        }
      }

      .photo-upload {
        margin-top: 20px;

        .image-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;

          .comment-image {
            width: 100%;
            height: 150px;
            border-radius: 5px;
            object-fit: cover;
          }
        }
      }
    }
  }

  .button-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    margin-right: 20px;
  }
}
</style>
