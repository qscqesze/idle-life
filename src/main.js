import { createApp } from 'vue'
import App from './App.vue'

console.log('正在挂载Vue应用...');
const app = createApp(App);
app.config.errorHandler = (err) => {
  console.error('Vue错误:', err);
};
app.mount('#app');
console.log('Vue应用挂载完成');
