import axios from 'axios'
import { Base64 } from 'js-base64'
import { ElMessageBox } from 'element-plus'

//创建公用axios配置
let instance = axios.create({
    timeout: 3000,
    responseType: "json",
    headers: {
        "Content-type": "application/json"
    }
})


// base64
function b64Fun(accont) {
    const base64 = Base64.encode(accont)
    return  base64
}

// http拦截： axios请求发送之前给每一个接口携带Authorization
instance.interceptors.request.use(
    config => {
        let token = localStorage.getItem('token')
        if(token) {
            config.headers.Authorization = token
        }
        return config
    },
    err => {
        return Promise.reject(err)
    }
)

// http拦截： axios请求发送之后
instance.interceptors.response.use(
    response => {
        return response
    },
    error => {
        if(error.response){
            let ERRS = error.response.status
            let MSG = error.response.data.message
            let errdata = ERRS == 401 || ERRS == 400 ? MSG : '服务器内部错误'
            switch (ERRS) {
                case 401:
                    ElMessageBox.alert(errdata, '提示', {
                        confirmButtonText: '确认',
                        type: "error"
                    })
                    .then(res => {
                        // 跳转至首页
                        window.location.href = '/'
                        localStorage.removeItem('menuidex')
                    })
                    .catch(err => {
                        // 跳转至首页
                        window.location.href = '/'
                        localStorage.removeItem('menuidex')
                    })
                    break;
            }
        }
        return Promise.reject(error.response.data)
    }
)

export default instance