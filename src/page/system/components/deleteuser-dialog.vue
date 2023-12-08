<template>
    <div>
        <el-dialog
            v-model="res.centerDialogVisible"
            title="提示"
            width="30%"
            align-center
            :close-on-click-modal="false"
            
        >
            <span>删除用户后该用户无法登陆本平台，此用户数据也将被清空，请谨慎操作！</span>
            <template #footer>
            <span >
                <el-button @click="res.centerDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="deleteUser" :loading="res.isLoading">确认</el-button>
            </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import {reactive, getCurrentInstance} from 'vue'


export default {
    setup() {
        const {proxy} = getCurrentInstance()
        const res = reactive({
            centerDialogVisible: false,
            userId: 0,
            isLoading: false 
        })
        
        //删除用户
        const deleteUser = async() => {
            res.isLoading = true
           
            const rest = await new proxy.$request(proxy.$urls.m().userdelete + "?id=" + res.userId).modedelete()
      
            if (rest.data.code !== 200 ) {
                new proxy.$tips("删除用户失败，稍后重试", "error").notify()
            } 
            res.centerDialogVisible = false
            proxy.$emit('flushPage')
            res.isLoading = false        
           
        }

        // 被父组件user.vue调用
        function deleteDialog(userId) {
            res.centerDialogVisible = true
            res.userId = userId
        }

        return {res, deleteUser,deleteDialog}
    }
}
</script>