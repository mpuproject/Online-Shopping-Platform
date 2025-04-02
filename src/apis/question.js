import request from "@/utils/request";
import { ElMessage } from 'element-plus';

/**
 * @description: 获取商品的所有问题
 * @param {String} productId 商品ID
 * @return {Promise} Promise对象
 */
export const getProductQuestionsAPI = (productId) => {
  console.log('Fetching questions for product:', productId);
  return request({
    url: `/question/product/${productId}/`
  }).then(response => {
    console.log('GET question response:', response);
    // 确保返回完整响应
    return response;
  }).catch(error => {
    console.error('Error fetching questions:', error);
    // 返回一个解析为默认数据的Promise，避免组件中的错误
    return Promise.resolve({ data: { data: [] } });
  });
};

/**
 * @description: 提交商品问题
 * @param {String} productId 商品ID
 * @param {String} content 问题内容
 * @return {Promise} Promise对象
 */
export const submitQuestionAPI = (productId, content) => {
  console.log('Submitting question for product:', productId, 'Content:', content);
  return request({
    url: `/question/product/${productId}/`,
    method: 'POST',
    data: {
      content
    }
  }).then(response => {
    console.log('POST question response:', response);
    return response;
  }).catch(error => {
    console.error('Error submitting question:', error);
    ElMessage.error('Failed to submit question. Please try again later.');
    return Promise.reject(error);
  });
};

/**
 * @description: 回答问题
 * @param {String} questionId 问题ID
 * @param {String} content 回答内容
 * @return {Promise} Promise对象
 */
export const submitAnswerAPI = (questionId, content) => {
  console.log('Submitting answer for question:', questionId, 'Content:', content);
  return request({
    url: `/question/answer/${questionId}/`,
    method: 'POST',
    data: {
      content
    }
  }).then(response => {
    console.log('POST answer response:', response);
    return response;
  }).catch(error => {
    console.error('Error submitting answer:', error);
    ElMessage.error('Failed to submit answer. Please try again later.');
    return Promise.reject(error);
  });
}; 