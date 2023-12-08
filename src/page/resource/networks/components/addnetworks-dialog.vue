<template>
    <div>
        <el-dialog
            v-model="config.centerDialogVisible"
            title="新建网络设备"
            width="60%"
            align-center
            :close-on-click-modal="false"           
        >

            <div >
                <el-form
                    ref="addNetworksRef"
                    :model="networks"
                    :rules="rules"
                    label-width="120px"
                    label-position="right"
                    status-icon
                >
                
                <div style="display: flex" >
                    <!-- 基础信息 -->
                    <div style="width: 500px;">
                        <div class="input_block_title" >网络设备基础信息</div>

                        <div style="width: 400px; margin-left: 20px;">

                            <el-form-item label="主机名" prop="host_name"  >
                                <el-input v-model="networks.host_name" clearable  placeholder="请输入主机名"  />
                            </el-form-item>

                            <el-form-item label="厂商" prop="vendor"  >
                                <el-input v-model="networks.vendor" clearable   placeholder="请输入厂商名"  />
                            </el-form-item>

                            <el-form-item label="型号" prop="product_name" >
                                <el-input v-model="networks.product_name" clearable  placeholder="请输入设备型号"  />
                            </el-form-item>

                            <el-form-item label="序列号" prop="sn">
                                <el-input v-model="networks.sn" clearable   placeholder="请输入设备序列号"  />
                            </el-form-item>

                            <el-form-item label="资产编号" prop="asset_number" >
                                <el-input v-model="networks.asset_number" clearable  placeholder="请输入设备资产编号"  />
                            </el-form-item>
                        </div>
                    </div>

                    <!-- 网络及账号配置 -->
                    <div style="width: 500px;">
                        <div class="input_block_title">网络及账号配置</div>

                        <div style="width: 400px; margin-left: 20px;">
                        
                            <el-form-item label="管理IP地址" prop="mgt_ip"  >
                                <el-input v-model="networks.mgt_ip" clearable  placeholder="请输设备管理IP地址"  />
                            </el-form-item>

                            <el-form-item label="管理用户名" prop="mgt_user_name"  >
                                <el-input v-model="networks.mgt_user_name" clearable  placeholder="请输入设备管理用户名"  />
                            </el-form-item>

                            <el-form-item label="管理用户密码" prop="mgt_pwd"  >
                                <el-input v-model="networks.mgt_pwd" clearable  type="password" show-password placeholder="请输入设备管理用户密码"   />
                            </el-form-item>

                        </div>
                    </div>
                </div>

                <div style="display: flex;">

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
                                    <el-input v-model="networks.location" autosize  clearable class="inputflex"  placeholder="请输设备所在机柜位置"  />
                                </div>
                            </div>
                        </div> 

                        <div>
                            <div class="input-float ">
                                <div class="input_key">
                                    备注信息
                                </div>
                                <div class="input_value">
                                    <el-input v-model="networks.description" autosize type="textarea" clearable class="inputflex"  placeholder="请输入设备备注信息"  />
                                </div>
                            </div>
                        </div>       
                    </div>
                </div>

                </el-form>
                <!-- 表格下方功能按钮 -->
                <div style="float: right; margin-bottom: 40px; margin-right: 72px;margin-top: 20px;">
                    <el-button @click="config.centerDialogVisible = false">取消</el-button>
                    <el-button type="primary" :loading="config.isLoading" @click="addNetworks(addNetworksRef)" >确认</el-button>
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

        const addNetworksRef = ref()

        const rules = {
            mgt_ip: [
                { required: true, message: '管理IP地址不能为空', trigger: 'blur' },
                { pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, message: '请输入正确IP地址', trigger: 'blur' }
            ],
            mgt_pwd: [
                { required: true, message: '密码不能为空', trigger: 'blur' }
            ],
            host_name: [
                { required: true, message: '主机名不能为空', trigger: 'blur' }
            ],
            mgt_user_name: [
                { required: true, message: '管理用户名不能为空', trigger: 'blur' }
            ]
        }

        const selectUserId = ref()
        const selectTagId = ref()
        const networks = reactive({
            vendor: "",
            product_name: "",
            sn: "",
            asset_number: "",
            mgt_ip: "",
            mgt_user_name: "",
            mgt_pwd: "",
            owner_id: null,
            host_name: "",
            tag_id: null,
            location: "",
            description: ""

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


        const addNetworks  = async(addNetworksRef) => {
            const obj = {
                vendor: networks.vendor,
                product_name: networks.product_name,
                sn: networks.sn,
                asset_number: networks.asset_number,
                mgt_ip: networks.mgt_ip,
                mgt_user_name: networks.mgt_user_name,
                mgt_pwd: networks.mgt_pwd,
                owner_id: selectUserId.value,
                host_name: networks.host_name,
                tag_id: selectTagId.value,
                location: networks.location,
                description: networks.description
            }

            await addNetworksRef.validate((valid,fileds)=>{
                if (valid) {
                    config.isLoading = true
                    new proxy.$request(proxy.$urls.m().networksadd, obj).modepost()
                    .then(rest=>{
                        if (rest.data.code !== 200) {
                            new proxy.$tips("新建网络设备失败，稍后重试", "error").notify()
                        }
                        config.isLoading = false
                        config.centerDialogVisible = false
                        proxy.$emit('flushPage')
                    })
                }
            })
        }

        const addNetworksDialog = () => {
            getUserList(),
            getTagList()
            config.centerDialogVisible = true
        }

        return {
            networks,
            config,
            user,
            tag,
            selectUserId,
            selectTagId,
            addNetworks,
            addNetworksDialog,
            addNetworksRef,
            rules
        }
    }
    
})
</script>
