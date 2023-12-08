<template>
    <div>
        <el-dialog
            v-model="res.centerDialogVisible"
            title="提示"
            width="30%"
            align-center
            :close-on-click-modal="false"
            
        >
            <span>数据删除后不可恢复，确认要删除本条数据吗？</span>
            <template #footer>
            <span >
                <el-button @click="res.centerDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="deleteVm" :loading="res.isLoading">确认</el-button>
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
            VmId: 0,
            isLoading: false 
        })
        
        //删除虚拟机数据
        const deleteVm = async() => {
            res.isLoading = true
           
            const rest = await new proxy.$request(proxy.$urls.m().vmdelete + "?id=" + res.VmId).modedelete()
      
            if (rest.data.code !== 200 ) {
                new proxy.$tips("删除虚拟机数据失败，稍后重试", "error").notify()
            } 
            res.centerDialogVisible = false
            proxy.$emit('flushPage')
            res.isLoading = false        
           
        }

        // 被父组件调用
        function deleteVmDialog(VmId) {
            res.centerDialogVisible = true
            res.VmId = VmId
        }

        return {res, deleteVm,deleteVmDialog}
    }
}
</script>