<template>
    <div class="oderding">
        <div class="heading">
            <div>物理机管理</div>

            <!-- 表格上方功能按钮 -->
            <div class="table-head">
                <el-button type="primary"  @click="clickAddServer" >新建服务器</el-button>
                <div >
                    <el-button>
                        <el-icon @click="getServerList"><Refresh /></el-icon>
                    </el-button>  
                </div>   
            </div>

            <div>
                <!-- 物理机表格 -->
                <div>          
                    <el-table :data="server_arr" stripe   style="width: 100% " class="cell">
                        <el-table-column type="expand"  label=" ">
                            <template #default="props">
                                <div>
                                    <div class="kv_display">
                                        <div class="k_display">服务器序列号: </div>  
                                        <div>{{ props.row.sn }}</div>
                                    </div>
                                    <div class="kv_display">
                                        <div class="k_display">HDM管理用户名: </div> 
                                        <div>{{ props.row.hdm_user_name }}</div>
                                    </div>
                                    <div class="kv_display">
                                        <div class="k_display">HDM管理用户密码: </div>
                                        <div v-if="config.isHdmPwdDisplay === false" style="display: flex;align-items: center;">
                                            <div style="margin-right: 15px;"> ---- </div> <el-icon @click="hdmPwdDisplaySwitch"><View /></el-icon>
                                        </div>
                                        <div v-else  style="display: flex;align-items: center;">
                                            <div style="margin-right: 15px;">{{ props.row.hdm_password }}</div> <el-icon @click="hdmPwdDisplaySwitch"><Hide /></el-icon>
                                        </div>
                                    </div>
                                    <div class="kv_display">
                                        <div class="k_display">root用户密码: </div>
                                        <div v-if="config.isRootPwdDisplay === false" style="display: flex;align-items: center;">
                                            <div style="margin-right: 15px;"> ---- </div> <el-icon @click="rootPwdDisplaySwitch"><View /></el-icon>
                                        </div>
                                        <div v-else  style="display: flex;align-items: center;">
                                            <div style="margin-right: 15px;">{{ props.row.mgt_root_pwd }}</div> <el-icon @click="rootPwdDisplaySwitch"><Hide /></el-icon>
                                        </div>
                                    </div>
                                    <div class="kv_display">
                                        <div class="k_display">备注信息: </div>
                                        <div>{{ props.row.description }}</div>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>

                        <el-table-column prop="host_name" label="主机名"  />
                        <el-table-column prop="product_name" label="型号" width=100px />
                        <el-table-column prop="asset_number" label="资产编号"  />
                        <el-table-column prop="arch" label="架构" width=60px />
                        <el-table-column prop="location" label="位置" />
                        <el-table-column prop="hdm_ip,mgt_ip,storage_ip" label="网络配置"  width=200px>
                            <template #default="scope">
                                <div> HDM  IP: {{ scope.row.hdm_ip }} </div>
                                <div> 管理网IP:{{ scope.row.mgt_ip }} </div>
                                <div> 存储网IP:{{ scope.row.storage_ip }} </div>
                            </template>
                        </el-table-column> 
                        <el-table-column prop="hardware_cpu,hardware_mem,hardware_storage" label="硬件信息" >
                            <template #default="scope">
                                <div> CPU: {{ scope.row.hardware_cpu }} 核 </div>
                                <div> 内存：{{ scope.row.hardware_mem }} G </div>
                                <div> 硬盘：{{ scope.row.hardware_storage }} </div>
                            </template>
                        </el-table-column> 
                        <el-table-column prop="tag.name" label="资源分组" />
                        <el-table-column prop="user.username" label="责任人" width="120px"/>

                        <el-table-column fixed="right" label="操作" width="140">
                            <template #default="scope">
                                <el-button link type="primary" size="small" @click="clickOpenTerminal(scope.row.id)" >终端</el-button>
                                <el-button link type="primary" size="small" @click="clickUpdateServer(scope.row)" >编辑</el-button>
                                <el-button link type="primary" size="small" @click="clickDelete(scope.row.id)" >删除</el-button>
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

        <!-- 创建服务器弹窗 -->
        <addServerDialog ref="addServerDialog" @flushPage="getServerList"></addServerDialog>
        <!-- 编辑服务器弹窗 -->
        <updateServerDialog ref="updateServerDialog" @flushPage="getServerList" ></updateServerDialog>
        <!-- 删除服务器弹窗 -->
        <deleteServerDialog ref="deleteServerDialog" @flushPage="getServerList"></deleteServerDialog>

    </div>    
</template>

<script>
import {reactive, toRefs, onMounted, getCurrentInstance, ref} from 'vue'
import addServerDialog from './components/addserver-dialog.vue'
import updateServerDialog from './components/updateserver-dialog.vue'
import deleteServerDialog from './components/deleteserver-dialog.vue'
import {View, Hide, Refresh} from '@element-plus/icons-vue'
import qs from 'qs'

export default {
    components: {
        View,
        Hide,
        addServerDialog,
        updateServerDialog,
        deleteServerDialog,
        Refresh
    },
    setup() {
        const config = reactive({
            isHdmPwdDisplay: false,
            isRootPwdDisplay: false
        })
        const server = reactive({
            server_arr: [],
            page_size: 10,
            page: 1,
            total: 0
        })

        const addServerDialog = ref()
        const updateServerDialog = ref()
        const deleteServerDialog = ref()
        onMounted(()=>{
            getServerList()
        })

        const {proxy} = getCurrentInstance()

        // 查询服务器列表
        const getServerList = async()=> {
            const query = qs.stringify({
                page: server.page,
                size: server.page_size
            })
            try {
                const rest = await new proxy.$request(proxy.$urls.m().serverlist + "?" + query).modeget()
                
                if (rest.data.code !== 200 ) {
                    new proxy.$tips("获取服务器列表失败", "warning").notify()
                }
                server.server_arr = rest.data.data
                server.total = rest.data.total
                server.page = rest.data.page
                
            } catch (e) {
                if (e.code !== 401) {
                    new proxy.$tips("服务器错误，请稍后重试", "error").notify()
                }     
            }

        }


        // 更改每页展示条数后触发
        function handleSizeChange(val) {
            server.page_size = val
            getServerList()
        }

        // 更改页码后触发
        function handleCurrentChange(val) {
            server.page = val
            getServerList()
        }

        // 调用子组件
        const clickAddServer = () => {
            addServerDialog.value.addServerDialog()
        }

        // 调用子组件
        const clickDelete = (serverId)=> {
            deleteServerDialog.value.deleteServerDialog(serverId)
        }

        // 调用子组件
        const clickUpdateServer = (val)=> {
            updateServerDialog.value.updateServerDialog(val)
        }


        function hdmPwdDisplaySwitch() {
            config.isHdmPwdDisplay = !config.isHdmPwdDisplay
        }

        function rootPwdDisplaySwitch() {
            config.isRootPwdDisplay = !config.isRootPwdDisplay
        }

        const clickOpenTerminal = (serverId)=> { 
            let page = proxy.$router.resolve({
                name: 'webssh',
                query: {
                    id: serverId,
                    source: 'plat',
                    type: 'server'
                }
            })
            window.open(page.href,'_blank')
        }

        return {
            config, 
            hdmPwdDisplaySwitch,
            rootPwdDisplaySwitch,
            ...toRefs(server), 
            clickDelete, 
            clickUpdateServer, 
            clickAddServer,
            getServerList,
            handleSizeChange,
            handleCurrentChange,
            addServerDialog,
            updateServerDialog,
            deleteServerDialog,
            clickOpenTerminal,
            Refresh
        }
    }
}

</script>