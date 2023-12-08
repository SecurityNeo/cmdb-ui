<template>
    <div>
        <el-dialog
            v-model="config.centerDialogVisible"
            title="新建服务器"
            width="60%"
            align-center
            :close-on-click-modal="false"
            
        >

            <div >
                <el-form
                    ref="addServerRef"
                    :model="server"
                    :rules="rules"
                    label-width="120px"
                    status-icon
                >
                    <div style="display: flex;">
                        <!-- 基础信息 -->
                        <div style="width: 500px;">
                            <div class="input_block_title">服务器基础信息</div>

                            <el-form-item label="主机名" prop="host_name" style="margin-left: 40px;">
                                <el-input v-model="server.host_name" clearable  style="width: 300px;"  placeholder="请输入主机名"  />
                            </el-form-item>
                               
                            <div class="input-float ">
                                <div class="input_key">
                                    厂商
                                </div>
                                <div class="input_value">
                                    <el-input v-model="server.vendor" clearable class="inputflex"  placeholder="请输入厂商名"  />
                                </div>
                            </div>

                            <div class="input-float ">
                                <div class="input_key">
                                    型号
                                </div>
                                <div class="input_value">
                                    <el-input v-model="server.product_name" clearable class="inputflex"  placeholder="请输入服务器型号"  />
                                </div>
                            </div>

                            <div class="input-float ">
                                <div class="input_key">
                                    序列号
                                </div>
                                <div class="input_value">
                                    <el-input v-model="server.sn" clearable class="inputflex"  placeholder="请输入服务器序列号"  />
                                </div>
                            </div>

                            <div class="input-float ">
                                <div class="input_key">
                                    资产编号
                                </div>
                                <div class="input_value">
                                    <el-input v-model="server.asset_number" clearable class="inputflex"  placeholder="请输入服务器资产编号"  />
                                </div>
                            </div>

                            <div class="input-float ">
                                <div class="input_key">
                                    CPU架构
                                </div>
                                <div class="input_value">
                                    <div>
                                        <el-radio-group v-model="server.arch">
                                        <el-radio-button label="X86" />
                                        <el-radio-button label="ARM" />
                                        </el-radio-group>
                                    </div>
                                </div>
                            </div>

                        </div>


                        <!-- 服务器硬件信息 -->
                        <div>
                            <div class="input_block_title">服务器硬件信息</div>

                            <div>
                                <div class="input-float ">
                                    <div class="input_key">
                                        CPU核数
                                    </div>
                                    <div class="input_value">
                                        <el-input-number v-model="server.hardware_cpu" :min="1" :max="200" placeholder="CPU核数"  />
                                    </div>
                                </div>
                                
                                <div class="input-float ">
                                    <div class="input_key">
                                        内存(G)
                                    </div>
                                    <div class="input_value">
                                        <el-input-number v-model="server.hardware_mem" :min="1" :max="1000"   placeholder="内存容量"  />
                                    </div>
                                </div>

                                <div class="input-float ">
                                    <div class="input_key">
                                        硬盘容量
                                    </div>
                                    <div class="input_value">
                                        <el-input v-model="server.hardware_storage" clearable class="inputflex"  placeholder="请输入服务器硬盘容量信息:2*1.2T+1*900G"  />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div style="display: flex;">
                        <!-- 网络及账号配置 -->
                        <div style="width: 500px;">
                            <div class="input_block_title">网络及账号配置</div>

                            <el-form-item label="HDM IP地址" prop="hdm_ip" style="margin-left: 40px;width: 460px;">
                                <el-input v-model="server.hdm_ip" clearable  style="width: 300px;"  placeholder="请输入HDM管理IP地址"  />
                            </el-form-item>

                            <el-form-item label="HDM用户名" prop="hdm_user_name" style="margin-left: 40px;width: 460px;">
                                <el-input v-model="server.hdm_user_name" clearable  style="width: 300px;"  placeholder="请输入HDM管理用户名"  />
                            </el-form-item>

                            <el-form-item label="HDM用户密码" prop="hdm_password" style="margin-left: 40px;width: 460px;">
                                <el-input v-model="server.hdm_password" clearable  style="width: 300px;"  placeholder="请输入HDM管理用户密码"  />
                            </el-form-item>

                            <el-form-item label="管理网IP地址" prop="mgt_ip" style="margin-left: 40px;width: 460px;">
                                <el-input v-model="server.mgt_ip" clearable  style="width: 300px;"  placeholder="请输入管理网IP地址"  />
                            </el-form-item>

                            <el-form-item label="root用户密码" prop="mgt_root_pwd" style="margin-left: 40px;width: 460px;">
                                <el-input v-model="server.mgt_root_pwd" clearable  style="width: 300px;"  show-password placeholder="请输入root用户密码"  />
                            </el-form-item>

                            <el-form-item label="存储网IP地址" prop="storage_ip" style="margin-left: 40px;width: 460px;">
                                <el-input v-model="server.storage_ip" clearable  style="width: 300px;"  placeholder="请输入存储网IP地址"  />
                            </el-form-item>
                        </div>

                        <!-- 公共属性配置 -->
                        <div>
                            <div class="input_block_title">公共属性</div>

                            <div>
                                <div class="input-float ">
                                    <div class="input_key">
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
                                    <div class="input_key">
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
                                    <div class="input_key">
                                        位置
                                    </div>
                                    <div class="input_value">
                                        <el-input v-model="server.location" autosize type="textarea" clearable class="inputflex"  placeholder="请输服务器所在机柜位置"  />
                                    </div>
                                </div>
                            </div> 

                            <div>
                                <div class="input-float ">
                                    <div class="input_key">
                                        备注信息
                                    </div>
                                    <div class="input_value">
                                        <el-input v-model="server.description" autosize type="textarea" clearable class="inputflex"  placeholder="请输入服务器备注信息"  />
                                    </div>
                                </div>
                            </div>       
                        </div>
                    </div>
                </el-form>

                <!-- 表格下方功能按钮 -->
                <div style="float: right; margin-bottom: 40px; margin-right: 72px;margin-top: 20px;">
                    <el-button @click="config.centerDialogVisible = false">取消</el-button>
                    <el-button type="primary" :loading="config.isLoading" @click="addServer(addServerRef)" >确认</el-button>
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

        const config = reactive({
            centerDialogVisible: false,
            isLoading: false
        })

        const addServerRef = ref()

        const rules = {
            mgt_ip: [
                { required: true, message: '管理网IP地址不能为空', trigger: 'blur' },
                { pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, message: '请输入正确IP地址', trigger: 'blur' }
            ],
            hdm_ip: [
                { required: true, message: 'HDM IP地址不能为空', trigger: 'blur' },
                { pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, message: '请输入正确IP地址', trigger: 'blur' }
            ],
            hdm_user_name: [
                { required: true, message: 'HDM管理用户名不能为空', trigger: 'blur' }
            ],
            hdm_password: [
                { required: true, message: 'HDM管理用户密码不能为空', trigger: 'blur' }
            ],
            storage_ip: [
                { pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, message: '请输入正确IP地址', trigger: 'blur' }
            ],
            mgt_root_pwd: [
                { required: true, message: '密码不能为空', trigger: 'blur' }
            ],
            host_name: [
                { required: true, message: '主机名不能为空', trigger: 'blur' }
            ]
        }

        const selectUserId = ref()
        const selectTagId = ref()
        const server = reactive({
            hdm_ip: "",
            hdm_user_name: "",
            hdm_password: "",
            vendor: "",
            product_name: "",
            arch: "",
            sn: "",
            asset_number: "",
            mgt_ip: "",
            mgt_root_pwd: "",
            storage_ip: "",
            owner_id: null,
            host_name: "",
            tag_id: null,
            location: "",
            description: "",
            hardware_cpu: null,
            hardware_mem: null,
            hardware_storage: ""

        })

        const user = reactive({
            user_arr: []
        })
        const tag = reactive({
            tag_arr: []
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


        const addServer  = async(addServerRef) => {
            const obj = {
                hdm_ip: server.hdm_ip,
                hdm_user_name: server.hdm_user_name,
                hdm_password: server.hdm_password,
                vendor: server.vendor,
                product_name: server.product_name,
                arch: server.arch,
                sn: server.sn,
                asset_number: server.asset_number,
                mgt_ip: server.mgt_ip,
                mgt_root_pwd: server.mgt_root_pwd,
                storage_ip: server.storage_ip,
                owner_id: selectUserId.value,
                host_name: server.host_name,
                tag_id: selectTagId.value,
                location: server.location,
                description: server.description,
                hardware_cpu: server.hardware_cpu,
                hardware_mem: server.hardware_mem,
                hardware_storage: server.hardware_storage
            }

            await addServerRef.validate((valid,fileds)=>{
                if (valid){
                    config.isLoading = true
                    new proxy.$request(proxy.$urls.m().serseradd, obj).modepost()
                    .then(rest=>{
                        if (rest.data.code !== 200) {
                            new proxy.$tips("新建服务器失败，稍后重试", "error").notify()
                        }
                        config.isLoading = false
                        config.centerDialogVisible = false
                        proxy.$emit('flushPage')
                    })
                }    

            })

        }

        const addServerDialog = () => {
            getUserList(),
            getTagList()
            config.centerDialogVisible = true
        }

        return {
            server,
            addServerRef,
            rules,
            config,
            user,
            tag,
            selectUserId,
            selectTagId,
            addServer,
            addServerDialog
        }
    }
    
})
</script>
