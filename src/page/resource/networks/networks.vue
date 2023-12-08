<template>
    <div class="oderding">
        <div class="heading">
            <div>网络设备管理</div>

            <!-- 表格上方功能按钮 -->
            <div class="table-head">
                <el-button type="primary"  @click="clickAddNetworks" >新建网络设备</el-button>
            </div>

            <div>
                <!-- 网络设备表格 -->
                <div>          
                    <el-table :data="networks_arr" stripe   style="width: 100% " class="cell">
                        <el-table-column type="expand"  label=" ">
                            <template #default="props">
                                <div>
                                    <div class="kv_display">
                                        <div class="k_display">序列号: </div>  
                                        <div>{{ props.row.sn }}</div>
                                    </div>
                                    <div class="kv_display">
                                        <div class="k_display">管理用户名: </div>
                                        <div>{{ props.row.mgt_user_name }}</div>
                                    </div>
                                    <div class="kv_display">
                                        <div class="k_display">管理用户密码: </div>
                                        <div v-if="config.isRootPwdDisplay === false" style="display: flex;align-items: center;">
                                            <div style="margin-right: 15px;"> ---- </div> <el-icon @click="rootPwdDisplaySwitch"><View /></el-icon>
                                        </div>
                                        <div v-else  style="display: flex;align-items: center;">
                                            <div style="margin-right: 15px;">{{ props.row.mgt_pwd }}</div> <el-icon @click="rootPwdDisplaySwitch"><Hide /></el-icon>
                                        </div>
                                    </div>
                                    <div class="kv_display">
                                        <div class="k_display">备注信息: </div>
                                        <div>{{ props.row.description }}</div>
                                    </div>
                                </div>
                                <div class="topo_list">
                                    <h3>接口拓扑</h3>
                                    <div style="border-top: 2px solid rgb(0, 153, 255);">
                                        <el-table :data="props.row.interface_topologies" >
                                            <el-table-column label="本端接口名称" prop="src_interface_name" />
                                            <el-table-column label="对端设备名称" prop="target_netdevice.host_name" />
                                            <el-table-column label="对端接口名称" prop="target_interface_name" />
                                        </el-table>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="host_name" label="主机名"  />
                        <el-table-column prop="product_name" label="型号"  />
                        <el-table-column prop="asset_number" label="资产编号" width=180px />
                        <el-table-column prop="location" label="位置" width=140px />
                        <el-table-column prop="mgt_ip" label="管理地址"  width=120px />
                        <el-table-column prop="tag.name" label="资源分组" width=180px />
                        <el-table-column prop="user.username" label="责任人" width="120px"/>

                        <el-table-column fixed="right" label="操作" width="200">
                            <template #default="scope">
                                
                                <el-button link type="primary" size="small" v-if="scope.row.interface_topologies.length === 0" @click="clickAddNetworksTopo(scope.row.id)" >添加接口拓扑</el-button>
                                <el-button link type="primary" size="small" v-else @click="clickUpdateNetworksTopo(scope.row.interface_topologies,scope.row.id)" >编辑接口拓扑</el-button>
                                <el-button link type="primary" size="small" @click="clickUpdateNetworks(scope.row)" >编辑</el-button>
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
        <addNetworksDialog ref="addNetworksDialog" @flushPage="getNetworkList"></addNetworksDialog>
        <updateNetworksDialog ref="updateNetworksDialog" @flushPage="getNetworkList"></updateNetworksDialog>
        <deleteNetworksDialog ref="deleteNetworksDialog" @flushPage="getNetworkList"></deleteNetworksDialog>
        <addInterfaceTopoDialog ref="addInterfaceTopoDialog" @flushPage="getNetworkList"></addInterfaceTopoDialog>
        <updateInterfaceTopoDialog ref="updateInterfaceTopoDialog" @flushPage="getNetworkList"></updateInterfaceTopoDialog>
    
    </div>    
</template>

<script>
import {reactive, toRefs, onMounted, getCurrentInstance, ref} from 'vue'
import {View, Hide} from '@element-plus/icons-vue'
import addNetworksDialog from './components/addnetworks-dialog.vue'
import updateNetworksDialog from './components/updatenetworks-dialog.vue'
import deleteNetworksDialog from './components/deletenetworks-dialog.vue'
import addInterfaceTopoDialog from './components/addinterfacetopo-dialog.vue'
import updateInterfaceTopoDialog from './components/updateinterfacetopo-dialog.vue'
import qs from 'qs'

export default {
    components: {
        View,
        Hide,
        addNetworksDialog,
        updateNetworksDialog,
        deleteNetworksDialog,
        addInterfaceTopoDialog,
        updateInterfaceTopoDialog
    },
    setup() {
        const config = reactive({
            isRootPwdDisplay: false
        })
        const networks = reactive({
            networks_arr: [],
            page_size: 10,
            page: 1,
            total: 0
        })

        const addNetworksDialog = ref()
        const updateNetworksDialog = ref()
        const deleteNetworksDialog = ref()
        const addInterfaceTopoDialog = ref()
        const updateInterfaceTopoDialog = ref()

        onMounted(()=>{
            getNetworkList()
        })

        const {proxy} = getCurrentInstance()

        // 查询网络设备列表
        const getNetworkList = async()=> {
            const query = qs.stringify({
                page: networks.page,
                size: networks.page_size
            })
            try {
                const rest = await new proxy.$request(proxy.$urls.m().networkslist + "?" + query).modeget()
                
                if (rest.data.code !== 200 ) {
                    new proxy.$tips("获取网络设备列表失败", "warning").notify()
                }
                networks.networks_arr = rest.data.data
                networks.total = rest.data.total
                networks.page = rest.data.page
                
            } catch (e) {
                console.log(e);
                if (e.code !== 401) {
                    new proxy.$tips("服务器错误，请稍后重试", "error").notify()
                }     
            }

        }


        // 更改每页展示条数后触发
        function handleSizeChange(val) {
            networks.page_size = val
            getNetworkList()
        }

        // 更改页码后触发
        function handleCurrentChange(val) {
            networks.page = val
            getNetworkList()
        }

        const clickUpdateNetworks = (val)=> {
            updateNetworksDialog.value.updateNetworksDialog(val)
        }

        const clickAddNetworks = ()=> {
            addNetworksDialog.value.addNetworksDialog()
        }

        const clickDelete = (val)=> {
            deleteNetworksDialog.value.deleteNetworksDialog(val)
        }

        const clickAddNetworksTopo = (networks_id)=> {
            addInterfaceTopoDialog.value.addInterfaceTopoDialog(networks_id)
        }

        const clickUpdateNetworksTopo = (networks_topo,networks_id) => {
            updateInterfaceTopoDialog.value.updateInterfaceTopoDialog(networks_topo,networks_id)
        }

        function rootPwdDisplaySwitch() {
            config.isRootPwdDisplay = !config.isRootPwdDisplay
        }
        return {
            config, 
            rootPwdDisplaySwitch,
            ...toRefs(networks), 
            clickDelete, 
            clickAddNetworks,
            clickUpdateNetworks,
            clickUpdateNetworksTopo,
            clickAddNetworksTopo,
            getNetworkList,
            handleSizeChange,
            handleCurrentChange,
            addNetworksDialog,
            updateNetworksDialog,
            deleteNetworksDialog,
            addInterfaceTopoDialog,
            updateInterfaceTopoDialog
        }
    }
}

</script>