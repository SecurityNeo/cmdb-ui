<template>
    <div>
        <el-dialog
            v-model="config.centerDialogVisible"
            title="新建虚拟机"
            width="40%"
            align-center
            :close-on-click-modal="false"
            
        >

            <div >
                <el-form
                    ref="addVmRef"
                    :model="vm"
                    :rules="rules"
                    label-width="120px"
                    status-icon
                >
                    <div style="display: flex;margin-left: 40px;">
                        <!-- 基础信息 -->
                        <div style="width: 480px;">
                            <div class="input_block_title">虚拟机基础信息</div>
                            <el-form-item label="主机名" prop="host_name">
                                <el-input v-model="vm.host_name"  clearable class="inputflex"  placeholder="请请输入主机名"  />
                            </el-form-item>
                            <el-form-item label="管理网IP地址" prop="mgt_ip">
                                <el-input v-model="vm.mgt_ip"  clearable class="inputflex"  placeholder="请输入管理网IP地址"  />
                            </el-form-item>
                            <el-form-item label="root用户密码" prop="mgt_root_pwd">
                                <el-input v-model="vm.mgt_root_pwd"  clearable class="inputflex"  type="password" show-password placeholder="请输入root用户密码"  />
                            </el-form-item>
                            <el-form-item label="存储网IP地址" prop="storage_ip">
                                <el-input v-model="vm.storage_ip" clearable class="inputflex"  placeholder="请输入存储网IP地址"  />
                            </el-form-item>
                            <el-form-item label="备注信息址" prop="description">
                                <el-input v-model="vm.description" autosize type="textarea" clearable class="inputflex"  placeholder="请输入服务器备注信息"  />
                            </el-form-item>
                        </div>
                    </div>

                    <div style="display: flex; margin-left: 40px;">
                        <!-- 公共属性配置 -->
                        <div>
                            <div class="input_block_title">公共属性</div>

                            <div>
                                <div class="input-float ">
                                    <div class="input_key" style="width: 80px;">
                                        责任人
                                    </div>
                                    <div>
                                        <el-select v-model="selectUserId" value-key="id" placeholder="请选择责任人">
                                            <el-option
                                                v-for="item in user.user_arr"
                                                :key="item.id"
                                                :label="item.name_alias"
                                                :value="item.id"
                                                >

                                                <span style="float: left">{{ item.username }}</span>
                                                <span
                                                    style="float: right;color: var(--el-text-color-secondary);font-size: 13px;"
                                                    >{{ item.name_alias }}</span>
                                            </el-option>
                                        </el-select>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div class="input-float ">
                                    <div class="input_key" style="width: 80px;">
                                        资源标签
                                    </div>
                                    <div>
                                        <el-select v-model="selectTagId" value-key="id" placeholder="请选择资源标签">
                                            <el-option
                                                v-for="item in tag.tag_arr"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id"
                                                />
                                        </el-select>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div class="input-float ">
                                    <div class="input_key" style="width: 80px;">
                                        宿主机
                                    </div>
                                    <div>
                                        <el-select v-model="selectHostId" value-key="id" placeholder="请选择虚拟机所在宿主机">
                                            <el-option
                                                v-for="item in host.host_arr"
                                                :key="item.id"
                                                :label="item.host_name"
                                                :value="item.id"
                                                />
                                        </el-select>
                                    </div>
                                </div>
                            </div>    
                        </div>
                    </div>
                </el-form>
                <!-- 表格下方功能按钮 -->
                <div style="float: right; margin-bottom: 40px; margin-right: 72px;margin-top: 20px;">
                    <el-button @click="config.centerDialogVisible = false">取消</el-button>
                    <el-button type="primary" :loading="config.isLoading" @click="addVm(addVmRef)" >确认</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { reactive, getCurrentInstance, ref } from 'vue'
import qs from 'qs'

export default ({
    setup() {
        const {proxy} = getCurrentInstance()

        const addVmRef = ref()

        const rules = {
            mgt_ip: [
                { required: true, message: '管理网IP地址不能为空', trigger: 'blur' },
                { pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, message: '请输入正确IP地址', trigger: 'blur' }
            ],
            storage_ip: [
                { pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, message: '请输入正确IP地址', trigger: 'blur' }
            ],
            mgt_root_pwd: [
                { required: true, message: '密码不能为空', trigger: 'blur' }
            ],
            host_name: [
                { required: true, message: '主机名不能为空', trigger: 'blur' }
            ],
        }

        const config = reactive({
            centerDialogVisible: false,
            isLoading: false
        })

        const selectUserId = ref()
        const selectTagId = ref()
        const selectHostId = ref()
        const vm = reactive({
            mgt_ip: "",
            mgt_root_pwd: "",
            storage_ip: "",
            owner_id: null,
            host_name: "",
            tag_id: null,
            host_id: null,
            description: ""
        })

        const user = reactive({
            user_arr: []
        })
        const tag = reactive({
            tag_arr: []
        })
        const host = reactive({
            host_arr: []
        })

        // 查询用户列表
        const getUserList = async()=> {
            const query = qs.stringify({
                page: 1,
                size: 1000,
            })
            try {
                const rest = await new proxy.$request(proxy.$urls.m().userlist + "?" + query).modeget()
                
                if (rest.data.code !== 200 ) {
                    new proxy.$tips("获取用户列表失败", "warning").notify()
                }
                user.user_arr = rest.data.data
                
            } catch (e) {
                if (e.code !== 401) {
                    new proxy.$tips("服务器错误，请稍后重试", "error").notify() 
                }   
            }
        }
        
        // 查询资源标签列表
        const getTagList = async()=> {
            const query = qs.stringify({
                page: 1,
                size: 1000,
            })
            try {
                const rest = await new proxy.$request(proxy.$urls.m().tagList + "?" + query).modeget()
                
                if (rest.data.code !== 200 ) {
                    new proxy.$tips("获取资源标签列表失败", "warning").notify()
                }
                tag.tag_arr = rest.data.data
                
            } catch (e) {
                if (e.code !== 401) {
                    new proxy.$tips("服务器错误，请稍后重试", "error").notify()
                }   
            }
        }

                // 查询服务器列表
        const getServerList = async()=> {
            const query = qs.stringify({
                page: 1,
                size: 2000,
            })
            try {
                const rest = await new proxy.$request(proxy.$urls.m().serverlist + "?" + query).modeget()
                
                if (rest.data.code !== 200 ) {
                    new proxy.$tips("获取服务器列表失败", "warning").notify()
                }
                host.host_arr = rest.data.data
                
            } catch (e) {
                if (e.code !== 401) {
                    new proxy.$tips("服务器错误，请稍后重试", "error").notify()
                }     
            }

        }

        const addVm  = async(addVmRef) => {
            const obj = {
                mgt_ip: vm.mgt_ip,
                mgt_root_pwd: vm.mgt_root_pwd,
                storage_ip: vm.storage_ip,
                owner_id: selectUserId.value,
                host_name: vm.host_name,
                tag_id: selectTagId.value,
                host_id: selectHostId.value,
                description: vm.description,
            }
            await addVmRef.validate((valid, fields) => {
                if(valid) {
                    config.isLoading = true
                    new proxy.$request(proxy.$urls.m().vmadd, obj).modepost()
                    .then(rest=>{
                        if (rest.data.code !== 200) {
                            new proxy.$tips("新建虚拟机失败，稍后重试", "error").notify()
                        }
                        config.isLoading = false
                        config.centerDialogVisible = false
                        proxy.$emit('flushPage')
                    })
                }
            })

        }

        const addVmDialog = () => {
            getUserList(),
            getTagList(),
            getServerList()
            config.centerDialogVisible = true
        }

        return {
            vm,
            addVmRef,
            rules,
            config,
            user,
            tag,
            host,
            selectHostId,
            selectUserId,
            selectTagId,
            addVm,
            addVmDialog
        }
    }
    
})
</script>
