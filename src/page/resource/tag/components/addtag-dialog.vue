<template>
    <div>
        <el-dialog
            v-model=config.centerDialogVisible
            title="新建标签"
            width="30%"
            align-center
            :close-on-click-modal="false"            
        >
        <div>
            <el-form
                    ref="addTagRef"
                    :model="tag"
                    :rules="rules"
                    label-width="120px"
                    status-icon
                >
                
                <div style="width: 400px; margin-left: 20px;">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="tag.name" clearable  style="width: 300px;"  placeholder="请输入标签名称"  />
                    </el-form-item>

                    <el-form-item label="描述" prop="description">
                        <el-input v-model="tag.description" clearable type="textarea" class="inputflex"  placeholder="请输入描述信息"  />
                    </el-form-item>
                </div>
            </el-form>

        
            <div style="float: right; margin-bottom: 40px; margin-right: 72px;margin-top: 20px;">
                <el-button @click="config.centerDialogVisible = false">取消</el-button>
                <el-button type="primary" :loading="config.isLoading" @click="addTag(addTagRef)" >确认</el-button>
            </div>
                     

        </div>
        </el-dialog>
    </div>
</template>

<script>
import {reactive, getCurrentInstance, ref} from 'vue'

export default {
    setup() {
        const tag = reactive({
            name: "",
            description: ""
        })

        const addTagRef = ref()
        const rules = {
            name: [
                { required: true, message: '标签名称不能为空', trigger: 'blur' }
            ]
        }

        const config = reactive({
            centerDialogVisible: false,
            isLoading: false
        })

        const {proxy} = getCurrentInstance()
        const addTag = async(addTagRef) => {
            await addTagRef.validate((valid,fileds)=>{
                if(valid) {
                    config.isLoading = true
                    new proxy.$request(proxy.$urls.m().tagAdd, tag).modepost()
                    .then(rest=>{
                        if (rest.data.code !== 200) {
                            new proxy.$tips("创建标签失败，稍后重试", "error").notify()
                        }
                        config.isLoading = false
                        config.centerDialogVisible = false
                        proxy.$emit('flushPage')
                    })
                }
            })
        }

        const addTagDialog = ()=> {
            config.centerDialogVisible = true
        }

        return {tag, config, addTag, addTagDialog,addTagRef,rules}
    }
}
</script>