<template>
    <div class="oderding">
        <div class="heading">
            <div>用户管理</div>

            <!-- 表格上方功能按钮 -->
            <div class="table-head">
                <el-button type="primary" @click="clickAdduser" v-if="userRole === 'admin'" >新建用户</el-button>
                <el-button type="primary" v-else disabled >新建用户</el-button>
            </div>
            
            <div>
                <!-- 用户表格 -->
                <div>          
                    <el-table :data="user_arr" stripe   style="width: 100% " class="cell">
                        <el-table-column prop="username,name_alias" label="用户名/姓名" >
                            <template #default="scope">
                                <div> {{ scope.row.username }} </div>
                                <div style="font-size: 11px;"> {{ scope.row.name_alias }} </div>
                            </template>
                            </el-table-column>
                        <el-table-column prop="phone" label="电话" width="200px"/>
                        <el-table-column prop="mail" label="邮箱" width=280px />
                        <el-table-column prop="role" label="角色" width=180px>
                            <template #default="scope">
                                <div v-if="scope.row.role === 'admin'">  系统管理员 </div>
                                <div v-else> 普通用户 </div>
                            </template>
                            </el-table-column>
                        <el-table-column prop="CreatedAt" :formatter="formatTime" label="创建时间"  />
                        <el-table-column fixed="right" label="操作" width="120">
                            <template #default="scope">
                                <!-- 系统管理员不允许编辑与删除 -->
                                <!-- 系统管理员可以操作所有普通用户数据 -->
                                <!-- 普通用户只能编辑自己用户数据，不能删除用户 -->
                                <el-button link type="primary" size="small" v-if="scope.row.id === 1 " disabled>编辑</el-button>
                                <el-button link type="primary" size="small" v-else-if="userRole === 'user' && JSON.stringify(scope.row.id) !== userId " disabled>编辑</el-button>
                                <el-button link type="primary" size="small" v-else @click="clickUpdateUser(scope.row)" >编辑</el-button>
                                <el-button link type="primary" size="small" v-if="scope.row.id === 1" disabled>删除</el-button>
                                <el-button link type="primary" size="small" v-else-if="userRole === 'user'" disabled>删除</el-button>
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
        <!-- 删除用户弹窗 -->
        <deleteUserDialog ref="deleteUserDialog" @flushPage="getUserList"></deleteUserDialog>
        <!-- 创建用户弹窗 -->
        <addUserDialog ref="addUserDialog" @flushPage="getUserList"></addUserDialog>
        <!-- 编辑用户弹窗 -->
        <updateUserDialog ref="updateUserDialog" @flushPage="getUserList"></updateUserDialog>

    </div>
</template>

<script>

import { getCurrentInstance,onMounted, reactive,toRefs, ref  } from 'vue'
import deleteUserDialog from './components/deleteuser-dialog.vue'
import addUserDialog from './components/adduser-dialog.vue'
import updateUserDialog from './components/updateuser-dialog.vue'
import qs from 'qs'

export default {
    components: {
        deleteUserDialog,
        addUserDialog,
        updateUserDialog
    },
    methods: {
        formatTime(row, column,cellValue){
            return new Date(cellValue).toLocaleString()
        }
    },
    setup() {
        const {proxy} = getCurrentInstance()
        let deleteUserDialog = ref()
        let addUserDialog = ref()
        let updateUserDialog = ref()
        const config = reactive({
            userRole: "",
            userId: ''
        })
        const users = reactive(
            {
                user_arr: [],
                page_size: 10,
                page: 1,
                total: 0
            }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
        )

        onMounted(()=>{
            getUserList()
            config.userRole = localStorage.getItem("role")
            config.userId = localStorage.getItem("userid")
        })

        // 查询用户列表
        const getUserList = async()=> {
            const query = qs.stringify({
                page: users.page,
                size: users.page_size
            })
            try {
                const rest = await new proxy.$request(proxy.$urls.m().userlist + "?" + query).modeget()
                
                if (rest.data.code !== 200 ) {
                    new proxy.$tips("获取用户列表失败", "warning").notify()
                }
                users.user_arr = rest.data.data
                users.total = rest.data.total
                users.page = rest.data.page
                
            } catch (e) {
                if (e.code !== 401) {
                    new proxy.$tips("服务器错误，请稍后重试", "error").notify()
                }   
            }
        }

        // 更改每页展示条数后触发
        function handleSizeChange(val) {
            users.page_size = val
            getUserList()
        }

        // 更改页码后触发
        function handleCurrentChange(val) {
            users.page = val
            getUserList()
        }

        // 调用子组件userDialog中的deleteDialog，将用户ID传给子组件
        const clickDelete = (userId) => {
            deleteUserDialog.value.deleteDialog(userId)
        }

        // 调用子组件
        const clickAdduser = () => {
            addUserDialog.value.addUserDialog()
        }

        // 调用子组件
        const clickUpdateUser = (user) => {
            updateUserDialog.value.updateUserDialog(user)
        }

        return {
            ...toRefs(config),
            ...toRefs(users), 
            handleSizeChange, 
            handleCurrentChange, 
            clickDelete, 
            getUserList, 
            clickAdduser,
            clickUpdateUser, 
            deleteUserDialog,
            addUserDialog,
            updateUserDialog 
        }
    }
}
</script>

<style>

</style>