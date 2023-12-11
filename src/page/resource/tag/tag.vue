<template>
    <div class="oderding">
        <div class="heading">
            <div>资源标签管理</div>

            <!-- 表格上方功能按钮 -->
            <div class="table-head">
                <el-button type="primary" @click="clickAddTag" >新建标签</el-button>
                <div >
                    <el-button>
                        <el-icon @click="getTagList"><Refresh /></el-icon>
                    </el-button>  
                </div>    
            </div>
            
            <div>
                <!-- 用户表格 -->
                <div>          
                    <el-table :data="tag_arr" stripe   style="width: 100% " class="cell">
                        <el-table-column prop="name" label="名称" width= "240px"/>
                        <el-table-column prop="description" label="描述" />
                        <el-table-column prop="CreatedAt" :formatter="formatTime" label="创建时间" width="180px" />
                        <el-table-column prop="UpdatedAt" :formatter="formatTime" label="更新时间"  width="180px" />
                        <el-table-column fixed="right" label="操作" width="120">
                            <template #default="scope">
                                <el-button link type="primary" size="small" v-if="scope.row.id === 1" disabled>编辑</el-button>
                                <el-button link type="primary" size="small" v-else @click="clickUpdateTag(scope.row)" >编辑</el-button>
                                <el-button link type="primary" size="small" v-if="scope.row.id === 1" disabled>删除</el-button>
                                <el-button link type="primary" size="small" v-else @click="clickDelete(scope.row.id)" >删除</el-button>
                            </template>
                        </el-table-column>   
                    </el-table>
                </div>

                <!-- 分页模块 -->
                <div class="pagination">
                    <el-pagination
                    v-model:current-page="page"
                    v-model:page-size="page_size"
                    :page-sizes="[10, 20, 50, 100]"
                    small
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    />
                </div>
            </div>
        </div>
        <addTagDialog ref="addTagDialog" @flushPage="getTagList"> </addTagDialog>
        <updateTagDialog ref="updateTagDialog" @flushPage="getTagList"></updateTagDialog>
        <deleteTagDialog  ref="deleteTagDialog" @flushPage="getTagList" ></deleteTagDialog>
    </div>
</template>

<script>

import { getCurrentInstance,onMounted, reactive,toRefs,ref } from 'vue'
import addTagDialog from './components/addtag-dialog.vue'
import updateTagDialog from './components/updatetag-dialog.vue'
import deleteTagDialog from './components/deletetag-dialog.vue'
import { Refresh} from '@element-plus/icons-vue'
import qs from 'qs'

export default {
    components: {
        addTagDialog,
        updateTagDialog,
        deleteTagDialog,
        Refresh
    },
    methods: {
        formatTime(row, column,cellValue){
            return new Date(cellValue).toLocaleString()
        }
    },
    setup() {
        const {proxy} = getCurrentInstance()

        const addTagDialog = ref()
        const updateTagDialog = ref()
        const deleteTagDialog = ref()

        const tags = reactive(
            {
                tag_arr: [],
                page_size: 10,
                page: 1,
                total: 0
            }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
        )

        onMounted(()=>{
            getTagList()
        })

        // 查询资源标签列表
        const getTagList = async()=> {
            const query = qs.stringify({
                page: tags.page,
                size: tags.page_size,
            })
            try {
                const rest = await new proxy.$request(proxy.$urls.m().tagList + "?" + query).modeget()
                
                if (rest.data.code !== 200 ) {
                    new proxy.$tips("获取资源标签列表失败", "warning").notify()
                }
                tags.tag_arr = rest.data.data
                
            } catch (e) {
                if (e.code !== 401) {
                    new proxy.$tips("服务器错误，请稍后重试", "error").notify()
                }   
            }
        }

        // 更改每页展示条数后触发
        function handleSizeChange(val) {
            users.page_size = val
            getTagList()
        }

        // 更改页码后触发
        function handleCurrentChange(val) {
            users.page = val
            getTagList()
        }

        function clickAddTag() {
            addTagDialog.value.addTagDialog()
        }

        function clickUpdateTag(tagDetail) {
            updateTagDialog.value.updateTagDialog(tagDetail)
        }

        function clickDelete(tagId) {
            deleteTagDialog.value.deleteTagDialog(tagId)
        }

        return {
            ...toRefs(tags), 
            handleSizeChange, 
            handleCurrentChange,
            clickAddTag,
            clickUpdateTag,
            clickDelete,
            getTagList,
            addTagDialog,
            updateTagDialog,
            deleteTagDialog,
            Refresh
        }
    }
}
</script>

<style>

</style>