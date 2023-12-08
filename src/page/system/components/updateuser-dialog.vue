<template>
    <div>
        <el-dialog
            v-model=config.centerDialogVisible
            title="编辑用户"
            width="30%"
            align-center
            :close-on-click-modal="false"            
        >
        <div>
            <div style="margin-right: 72px">
                <el-form
                    ref="updateUserRef"
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
                    <el-form-item label="姓名" prop="name_alias">
                        <el-input v-model="user.name_alias" clearable class="inputflex"  placeholder="请输入姓名，如不填，则与用户名保持一致"  />
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
                    <el-button type="primary" :loading="config.isLoading" @click="updateUser(updateUserRef)" >确认</el-button>
                </div>                    
            </div>
        </div>
        </el-dialog>
    </div>
</template>

<script>
import {reactive, getCurrentInstance, ref} from 'vue'

export default {
    setup() {
        const user = reactive({
            id: 0,
            account: "",
            name_alias: "",
            mail: "",
            phone: ""
        })

        const updateUserRef = ref() 
        const rules = {
            phone: [
                { pattern: /^[1][0-9]{10}$/,message: '请输入正确手机号码',trigger: 'blur'}
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
        const updateUser = async(updateUserRef) => {
            const obj = {
                id: user.id,
                name_alias: user.name_alias,
                mail: user.mail,
                phone: user.phone,
            }
            await updateUserRef.validate((valid, fields) => {
                if (valid) {
                    config.isLoading = true
                    new proxy.$request(proxy.$urls.m().userupdate, obj).modepost()
                    .then(rest=>{
                        if (rest.data.code !== 200) {
                            new proxy.$tips("更新用户失败，稍后重试", "error").notify()
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
        function updateUserDialog(userDetail) {
            config.centerDialogVisible = true
            user.id = userDetail.id
            user.account = userDetail.username
            user.name_alias = userDetail.name_alias
            user.mail = userDetail.mail
            user.phone = userDetail.phone
            console.log(userDetail);
        }

        return {config, updateUser,updateUserDialog, user,updateUserRef,rules}
    }
}

</script>