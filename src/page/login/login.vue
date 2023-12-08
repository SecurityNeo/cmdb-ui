<template>
    <div id='backcont'>  
        <div id="gifcont">

        </div>
    </div>
    <div class="meituan-content">

        <div class="login-content">
        
            <div class="login-title ">
                登录         
                <div class="login-user">
                    <p class="login-user-p">
                        <el-input v-model="account" clearable class="inputflex"  placeholder="用户名"  />
                    </p>
                </div>
                <div class="login-user">
                    <p class="login-user-p">
                        <el-input v-model="password" clearable class="inputflex" type="password" placeholder="密码" show-password />
                    </p>
                </div>

                <p>
                    <el-button type="primary" @click="login" @keydown.enter="keyDown()" :loading="isLoading" class="login-botton">登录</el-button>
                </p>
            </div>

        </div>

    </div>
</template>

<script>

import { reactive, toRefs, getCurrentInstance,onMounted,onUnmounted } from "vue"
import { Base64 } from 'js-base64'
import {useRouter} from 'vue-router'


export default {
    setup(){
        const router = useRouter()
        const {proxy} = getCurrentInstance()
        const user = reactive({
            account: '',
            password: '',
            isLoading: false
        })
        
        // 实现按下键盘回车触发login
        // 键盘事件：keyDown（键盘按键按下时触发）
        
        const keyDown = (e) => {
            // 13 为控制键键码对应的Enter,108为数字键盘对应的Enter。
            if (e.keyCode == 13 || e.keyCode == 108) {
                login();
            }
        }     
        onMounted(() => {
            window.addEventListener('keydown', keyDown);
        });
        onUnmounted(() => {
            window.removeEventListener('keydown', keyDown, false);
        });

        const login = async()=> {
            user.isLoading = true
            const obj = {
                username: user.account,
                password: Base64.encode(user.password)
            }

            try {
                const rest = await new proxy.$request(proxy.$urls.m().login, obj).modepost()

                if (rest.data.code !== 200 ) {
                    new proxy.$tips("用户名或密码错误,请重新输入", "warning").notify()
                } else {
                    // 保存token至本地缓存
                    localStorage.setItem('token',rest.data.data.token)
                    // 保存用户角色信息至本地缓存
                    localStorage.setItem('role',rest.data.data.role)
                    // 保存用户名称信息至本地缓存
                    localStorage.setItem('username',rest.data.data.username)
                    // 保存用户ID至本地缓存
                    localStorage.setItem('userid',JSON.stringify(rest.data.data.userid))
                    // 页面跳转至index页面
                    router.push({name:'index'})
                }
                user.isLoading = false
            } catch (e) {
                new proxy.$tips("服务未就绪，请稍后重试", "error").notify()
                user.isLoading = false
            }
            
        }

        return { ...toRefs(user), login, keyDown }
    }
}
</script>

<style>

</style>