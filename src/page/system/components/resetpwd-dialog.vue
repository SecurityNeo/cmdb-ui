<template>
    <div>
        <el-dialog
            v-model=config.centerDialogVisible
            title="重置密码"
            width="35%"
            align-center
            :close-on-click-modal="false"            
        >
        <div>
            <div style="margin-right: 72px">
                <el-form
                    ref="restPwdRef"
                    :model="user"
                    :rules="rules"
                    label-width="120px"
                    status-icon
                >
                    <el-form-item label="用户名" prop="account">
                        <div >
                            <span>
                                {{user.account}}
                            </span>
                        </div>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="user.password" clearable class="inputflex" type="password" placeholder="请输入新密码" show-password />
                    </el-form-item>
                    <el-form-item label="确认密码" prop="re_password">
                        <el-input v-model="user.re_password" clearable class="inputflex" type="password" placeholder="请确认新密码" show-password />
                    </el-form-item>
                </el-form>
            </div>
            <div>         
                <div style="float: right; margin-bottom: 40px; margin-right: 72px;margin-top: 20px;">
                    <el-button @click="config.centerDialogVisible = false">取消</el-button>
                    <el-button type="primary" :loading="config.isLoading" @click="resetPwd(restPwdRef)" >确认</el-button>
                </div>                    
            </div>
        </div>
        </el-dialog>
    </div>
</template>

<script>
import {reactive, getCurrentInstance, ref} from 'vue'
import { Base64 } from 'js-base64'

export default {
    setup() {
        const user = reactive({
            id: 0,
            account: "",
            password: "",
            re_password: ""
        })

        const restPwdRef = ref() 
        const rules = {
            password: [
                { required: true, message: '密码不能为空', trigger: 'blur' },
                { pattern: /^.*(?=.{6,16})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/, message: '至少包括1个大写字母，1个小写字母，1个数字，1个特殊字符,长度为6-16位',trigger: 'blur'}
            ],
            re_password: [
                { required: true, message: '密码不能为空', trigger: 'blur' },
                { 
                    validator:  function(rule, value, callback) {
                        if (value !== user.password) {
                            callback( new Error('两次输入的密码必须相同'))
                        }
                        return true
                    },trigger: 'blur'
				}
            ],
        }

        const config = reactive({
            centerDialogVisible: false,
            isLoading: false
        })

        const {proxy} = getCurrentInstance()
        const resetPwd = async(restPwdRef) => {
            const obj = {
                id: user.id,
                password: Base64.encode(user.password)
            }
            await restPwdRef.validate((valid, fields) => {
                if (valid) {
                    config.isLoading = true
                    new proxy.$request(proxy.$urls.m().userpwdupdate, obj).modepost()
                    .then(rest=>{
                        if (rest.data.code !== 200) {
                            new proxy.$tips("修改用户密码失败，稍后重试", "error").notify()
                        }
                        config.isLoading = false
                        config.centerDialogVisible = false
                        proxy.$emit('flushPage')
                    })
                    .catch()
                    
                }
            })
        }

        // 被父组件user.vue调用
        function resetPwdDialog(userDetail) {
            config.centerDialogVisible = true
            user.id = userDetail.id
            user.account = userDetail.username
        }

        return {config, resetPwd,resetPwdDialog, user,restPwdRef,rules}
    }
}

</script>