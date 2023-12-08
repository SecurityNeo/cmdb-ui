import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import '../style/headtap.css'



const app = createApp(App)
app.use(ElementPlus, {
    locale: zhCn,
  })
app.use(router)



// 请求地址
import urls from '../api/api'
app.config.globalProperties.$urls = urls

// 接口请求
import request from '../api/request'
app.config.globalProperties.$request = request

// 弹窗提示
import tips from '../utils/tips'
app.config.globalProperties.$tips = tips

// import formatDate from '../utils/formatDatetDate.js'
// app.config.globalProperties.$formatDate = formatDate

app.mount('#app')
