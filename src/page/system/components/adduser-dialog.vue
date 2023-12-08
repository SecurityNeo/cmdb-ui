<template>
    <div>
        <el-dialog
            v-model=config.centerDialogVisible
            title="新建用户"
            width="35%"
            align-center
            :close-on-click-modal="false"            
        >
        <div>
            <div style="margin-right: 72px">
                <el-form
                    ref="addUserRef"
                    :model="user"
                    :rules="rules"
                    label-width="120px"
                    status-icon
                >
                    <el-form-item label="用户名" prop="account">
                        <el-input v-model="user.account"  clearable class="inputflex"  placeholder="请输入用户名（1-20位）"  />
                    </el-form-item>
                    <el-form-item label="姓名" prop="name_alias">
                        <el-input v-model="user.name_alias" clearable class="inputflex"  placeholder="请输入姓名，如不填，则与用户名保持一致"  />
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="user.password" clearable class="inputflex" type="password" placeholder="请输入密码" show-password />
                    </el-form-item>
                    <el-form-item label="确认密码" prop="re_password">
                        <el-input v-model="user.re_password" clearable class="inputflex" type="password" placeholder="请确认密码" show-password />
                    </el-form-item>
                    <el-form-item label="电子邮箱" prop="mail">
                        <el-input v-model="user.mail" clearable class="inputflex"  placeholder="请输入电子邮箱"  />
                    </el-form-item>
                    <el-form-item label="电话号码" prop="phone">
                        <el-input v-model="user.phone" clearable class="inputflex"  placeholder="请输入电话号码"  />
                    </el-form-item>
                </el-form>
            </div>
            <div>         
                <div style="float: right; margin-bottom: 40px; margin-right: 72px;margin-top: 20px;">
                    <el-button @click="config.centerDialogVisible = false">取消</el-button>
                    <el-button type="primary" :loading="config.isLoading" @click="addUser(addUserRef)" >确认</el-button>
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
            account: "",
            name_alias: "",
            password: "",
            re_password: "",
            mail: "",
            phone: ""
        })

        const addUserRef = ref()         

        const rules = {
            account: [
                { required: true, message: '用户名不能为空', trigger: 'blur' },
                { pattern: /^[a-zA-Z0-9]{1,20}$/, message: '英文字母（a-z,A-Z）、数字(0-9)，长度为1-20位', trigger: 'blur' }
            ],
            phone: [
                { pattern: /^[1][0-9]{10}$/,message: '请输入正确手机号码',trigger: 'blur'}
            ],
            password: [
                { required: true, message: '密码不能为空', trigger: 'blur' },
                { pattern: /^.*(?=.{6,16})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/, message: '至少包括1个大写字母，1个小写字母，1个数字，1个特殊字符,长度为6-16位',trigger: 'blur'}
            ],
            re_password: [
                { required: true, message: '密码不能为空', trigger: 'blur' },
                { 
                    validator:  function(rule, value, callback) {
                        console.log(value);
                        if (value !== user.password) {
                            callback( new Error('两次输入的密码必须相同'))
                        }
                        return true
                    },trigger: 'blur'
				}
            ],
            mail: [
                { pattern: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,message: '请输入正确邮箱地址',trigger: 'blur'}
            ],
        }

        const config = reactive({
            centerDialogVisible: false,
            isLoading: false
        })

        const {proxy} = getCurrentInstance()
        const addUser = async(addUserRef) => {
            const obj = {
                username: user.account,
                name_alias: user.name_alias,
                password: Base64.encode(user.password),
                mail: user.mail,
                phone: user.phone,
                role: "user"
            }
            await addUserRef.validate((valid, fields) => {
                if (valid) {
                    config.isLoading = true
                    new proxy.$request(proxy.$urls.m().useradd, obj).modepost()
                    .then(rest=>{
                        if (rest.data.code !== 200) {
                            new proxy.$tips("创建用户失败，稍后重试", "error").notify()
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
        function addUserDialog() {
            config.centerDialogVisible = true
        }

        return {
            user, 
            rules,
            config, 
            addUser,
            addUserDialog,
            addUserRef
        }
    }
}
</script>