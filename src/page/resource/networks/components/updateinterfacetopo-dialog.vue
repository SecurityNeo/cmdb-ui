<template>
    <div>
        <el-dialog
            v-model="config.centerDialogVisible"
            title="编辑网络设备接线信息"
            width="50%"
            align-center
            :close-on-click-modal="false"           
        >

            <div>
                <div  v-for="(item,index) in config.input_block" :key="index" class="topo_block" >
                    <div style="display: flex;">
                        <div class="topo_title" style="width: 200px;">本端接口名称</div>
                        <div class="topo_title" style="width: 300px;">对端设备</div>
                        <div class="topo_title" style="width: 200px;">对端接口名称</div>
                    </div>
                    <div style="display: flex; margin-bottom: 10px;">
                        <div class="topo_value">
                            <el-input v-model="item.src_interface_name" autosize minlength=1 clearable class="inputflex"  placeholder="请输入本端接口名称"  />
                        </div>
                        <div class="topo_value" style="width: 280px;">
                            <el-select v-model="item.target_netdevice_id" value-key="id" placeholder="请选择对端网络设备">
                                <el-option
                                    v-for="networks_item in networks.networks_arr"
                                    :key="networks_item.id"
                                    :label="networks_item.host_name"
                                    :value="networks_item.id"
                                    >

                                    <span style="float: left">{{ networks_item.host_name }}</span>
                                    <span
                                        style="float: right;color: var(--el-text-color-secondary);font-size: 11px;"
                                        >{{ networks_item.product_name }}</span>
                                </el-option>
                            </el-select>
                        </div >
                        <div class="topo_value">
                            <el-input v-model="item.target_interface_name" autosize  clearable class="inputflex"  placeholder="请输入对端接口名称"  />
                        </div>
                        <div>
                            <el-button  @click="deleteContent(index)" size="small" style="margin-top: 3px;">删除</el-button>
                        </div>
                    </div>
                </div>

                <div style="margin-top: 15px;">
                    <el-button  @click="addContent">添加</el-button>
                </div>
                

                
                <div style="float: right; margin-bottom: 40px; margin-right: 72px;margin-top: 20px;">
                    <el-button @click="config.centerDialogVisible = false">取消</el-button>
                    <el-button type="primary" :loading="config.isLoading" @click="updateInterfaceTopo" >确认</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { reactive,  getCurrentInstance, toRefs } from 'vue'
import {Delete} from '@element-plus/icons-vue'
import qs from 'qs'

export default ({
    components: {
        Delete
    },
    setup() {
        const {proxy} = getCurrentInstance()
        const config = reactive({
            input_block: [],
            input_template: {
                src_netdevice_id: 0,
                src_interface_name: "",
                target_netdevice_id: null,
                target_interface_name: ""
            },
            centerDialogVisible: false,
            isLoading: false
        })
        const networks = reactive({
            networks_origin: [],
            networks_arr: []
        })
        const interfaceTopologyDetail = reactive({
            interfaceTopologyDetail: []
        })


        // 查询网络设备列表
        const getNetworkList = async()=> {
            const query = qs.stringify({
                page: 1,
                size: 1000
            })
            try {
                const rest = await new proxy.$request(proxy.$urls.m().networkslist + "?" + query).modeget()
                
                if (rest.data.code !== 200 ) {
                    new proxy.$tips("获取网络设备列表失败", "warning").notify()
                }
                networks.networks_origin = rest.data.data
                networks.networks_arr = rest.data.data

                for (let index = 0; index < networks.networks_origin.length; index++) {
                    if (networks.networks_origin[index].id === config.input_template.src_netdevice_id) {
                        networks.networks_arr.splice(index,1)
                        break
                    }
                    
                }              
            } catch (e) {
                console.log(e);
                if (e.code !== 401) {
                    new proxy.$tips("服务器错误，请稍后重试", "error").notify()
                }     
            }
        }

        // 编辑网络设备拓扑数据
        const updateInterfaceTopo = async()=> {           
            config.isLoading = true

            if (config.input_block.length === 0) {
                try {
                    const rest = await new proxy.$request(proxy.$urls.m().interfacetopologyDeleteBySrcId + "?id=" + config.input_template.src_netdevice_id).modedelete()
                    if (rest.data.code !== 200) {
                        new proxy.$tips("更新网络设备拓扑数据失败，稍后重试", "error").notify()
                    }
                    config.isLoading = false
                }  catch (e) {
                    if (e.code !== 401) {
                        new proxy.$tips("服务器错误，请稍后重试", "error").notify()
                    }     
                } 
            } else {
                try {
                    const rest = await new proxy.$request(proxy.$urls.m().interfacetopologyupdate, config.input_block).modepost()
                    if (rest.data.code !== 200) {
                        new proxy.$tips("更新网络设备拓扑数据失败，稍后重试", "error").notify()
                    }
                    config.isLoading = false
                }catch (e) {
                    if (e.code !== 401) {
                        new proxy.$tips("服务器错误，请稍后重试", "error").notify()
                    }     
                }
            }
            config.centerDialogVisible = false
            proxy.$emit('flushPage')    
        }

        
        const addContent = ()=> {
            config.input_block.push(JSON.parse(JSON.stringify(config.input_template)))
        }

        const deleteContent = (index)=> {
            config.input_block.splice(index, 1)
        }


        const updateInterfaceTopoDialog = (topoDetails,src_netdevice_id) => {
            config.centerDialogVisible= true
            getNetworkList()
            config.input_block = topoDetails
            config.input_template.src_netdevice_id = src_netdevice_id
        }
        
        return {
            config,
            networks,
            Delete,
            addContent,
            deleteContent,
            interfaceTopologyDetail,
            updateInterfaceTopoDialog,
            updateInterfaceTopo
        }
    }

    
    
})
</script>
