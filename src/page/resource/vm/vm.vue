<template>
    <div class="oderding">
        <div class="heading">
            <div>虚拟机管理</div>

            <!-- 表格上方功能按钮 -->
            <div class="table-head">
                <el-button type="primary" @click="clickAddVm" >新建虚拟机</el-button>
                <div >
                    <el-button>
                        <el-icon @click="getVmList"><Refresh /></el-icon>
                    </el-button>  
                </div>    
            </div>

            <div>
                <!-- 物理机表格 -->
                <div>          
                    <el-table :data="vm_arr" stripe   style="width: 100% " class="cell" >
                        <el-table-column type="expand" label=" ">
                            <template #default="props">
                                <div>
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
                        <el-table-column prop="host.arch" label="架构" width="100px" />
                        <el-table-column prop="mgt_ip,storage_ip" label="网络配置"  width=200px>
                            <template #default="scope">
                                <div> 管理网IP:{{ scope.row.mgt_ip }} </div>
                                <div> 存储网IP:{{ scope.row.storage_ip }} </div>
                            </template>
                        </el-table-column> 
                        <el-table-column prop="tag.name" label="资源分组" />
                        <el-table-column prop="host.host_name" label="宿主机名称" />
                        <el-table-column prop="host.hdm_ip,host.mgt_ip,host.storage_ip" label="宿主机网络配置"  width=200px>
                            <template #default="scope">
                                <div> HDM  IP: {{ scope.row.host.hdm_ip }} </div>
                                <div> 管理网IP: {{ scope.row.host.mgt_ip }} </div>
                                <div> 存储网IP: {{ scope.row.host.storage_ip }} </div>
                            </template>
                        </el-table-column> 
                        <el-table-column prop="user.username" label="责任人" width="120px"/>

                        <el-table-column fixed="right" label="操作" width="140">
                            <template #default="scope">
                                <el-button link type="primary" size="small" @click="clickOpenTerminal(scope.row.id)" >终端</el-button>
                                <el-button link type="primary" size="small" @click="clickUpdateVm(scope.row)" >编辑</el-button>
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

        <!-- 创建虚拟机弹窗 -->
        <addVmDialog ref="addVmDialog" @flushPage="getVmList"></addVmDialog>
        <!-- 编辑虚拟机弹窗 -->
        <updateVmDialog ref="updateVmDialog" @flushPage="getVmList" ></updateVmDialog>
        <!-- 删除虚拟机弹窗 -->
        <deleteVmDialog ref="deleteVmDialog" @flushPage="getVmList"></deleteVmDialog>
    </div>  
      
</template>

<script>
import {reactive, toRefs, onMounted, getCurrentInstance, ref} from 'vue'
import {View, Hide} from '@element-plus/icons-vue'
import addVmDialog from './components/addvm-dialog.vue'
import updateVmDialog from './components/updatevm-dialog.vue'
import deleteVmDialog from './components/deletevm-dialog.vue'
import { Refresh} from '@element-plus/icons-vue'



import qs from 'qs'

export default {
    components: {
        View,
        Hide,
        addVmDialog,
        updateVmDialog,
        deleteVmDialog,
        Refresh
    },
    setup() {
        const config = reactive({
            isRootPwdDisplay: false
        })
        const vm = reactive({
            vm_arr: [],
            page_size: 10,
            page: 1,
            total: 0
        })
        const addVmDialog = ref()
        const updateVmDialog = ref()
        const deleteVmDialog = ref()

        onMounted(()=>{
            getVmList()
        })

        const {proxy} = getCurrentInstance()

        // 查询服务器列表
        const getVmList = async()=> {
            const query = qs.stringify({
                page: vm.page,
                size: vm.page_size
            })
            try {
                const rest = await new proxy.$request(proxy.$urls.m().vmlist + "?" + query).modeget()
                
                if (rest.data.code !== 200 ) {
                    new proxy.$tips("获取虚拟机列表失败", "warning").notify()
                }
                vm.vm_arr = rest.data.data
                vm.total = rest.data.total
                vm.page = rest.data.page
                
            } catch (e) {
                console.log(e);
                if (e.code !== 401) {
                    new proxy.$tips("服务器错误，请稍后重试", "error").notify()
                }     
            }

        }


        // 更改每页展示条数后触发
        function handleSizeChange(val) {
            vm.page_size = val
            getVmList()
        }

        // 更改页码后触发
        function handleCurrentChange(val) {
            vm.page = val
            getVmList()
        }

        const clickAddVm = ()=> {
            addVmDialog.value.addVmDialog()
        }

        const clickUpdateVm = (val)=> {
            updateVmDialog.value.updateVmDialog(val)
        }

        const clickDelete = (val)=> {
            deleteVmDialog.value.deleteVmDialog(val)
        }
        const clickOpenTerminal = (vmId)=> { 
            let page = proxy.$router.resolve({
                name: 'webssh',
                query: {
                    id: vmId,
                    source: 'plat',
                    type: 'vm'
                }
            })
            window.open(page.href,'_blank')
        }

        function rootPwdDisplaySwitch() {
            config.isRootPwdDisplay = !config.isRootPwdDisplay
        }
        return {
            config, 
            rootPwdDisplaySwitch,
            ...toRefs(vm), 
            clickDelete, 
            clickUpdateVm, 
            clickAddVm,
            getVmList,
            handleSizeChange,
            handleCurrentChange,
            addVmDialog,
            updateVmDialog,
            deleteVmDialog,
            clickOpenTerminal,
            Refresh
        }
    }
}

</script>