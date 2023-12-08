<template>
    <div>
        // 顶部
        <div class="sidebar-top">
            <div>资产管理系统</div>
            <div>
                <el-dropdown>
                    <el-button class="userInfo" type="info" plain>
                        <div style="font-size: 15px;" v-if="userRole === 'admin'"> 系统管理员 {{ userName }}</div>
                        <div  style="font-size: 15px;" v-else> 普通用户 {{ userName }}</div>
                        <el-icon style="margin-left: 10px;"><arrow-down /></el-icon>
                    </el-button>
                    <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item >
                            <div @click="logout">退出</div>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>

        </div>
        // 侧边栏菜单
        <div class="sidebar-cont">
            <el-menu :default-active="ac_index" @select="Select">
                    <div v-for="(item,index) in menu" :key="index">
                        <router-link :to="{path:item.router}">
                            <el-menu-item v-if="item.subClass.length == 0" :index="item.id"> 
                                <el-icon>
                                    <component :is="item.icon"></component>
                                </el-icon>
                                <span>{{ item.title }}</span>
                            </el-menu-item>
                        </router-link>
                        <el-sub-menu v-if="item.subClass.length > 0" :index="item.id">
                            <template #title>
                                <el-icon>
                                    <component :is="item.icon"></component>
                                </el-icon>
                                <span>{{ item.title }}</span>
                            </template>
                            <div v-for="(v,k) in item.subClass" :key="k">
                                <router-link :to="{path: v.router}">
                                    <el-menu-item :index="v.id">{{ v.title }}</el-menu-item>
                                </router-link>
                            </div>
                        </el-sub-menu>
                    </div>
            </el-menu>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
import {Box, Management} from '@element-plus/icons-vue'
import { onMounted, reactive, ref, toRefs } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'


export default{
    components: {
        Box,
        Management,
        ArrowDown
    },
    setup() {
        const menuArr = [
            {
                id: '1',
                icon: "Box",
                title: "资源管理",
                router: "",
                subClass: [
                    {
                        id: '1-1',
                        title: "物理机管理",
                        router: "server"
                    },
                    {
                        id: '1-2',
                        title: "虚拟机管理",
                        router: "vm"
                    },
                    {
                        id: '1-3',
                        title: "网络设备管理",
                        router: "networks"
                    },
                    {
                        id: '1-4',
                        title: "资源分组管理",
                        router: "tag"
                    }
                ]
            },
            {
                id: '2',
                icon: "Management",
                title: "系统",
                router: "",
                subClass: [
                    {
                        id: '2-1',
                        title: "用户管理",
                        router: "user"
                    }
                ]
            }
        ]
        
        const config = reactive({
            userRole: "",
            userName: ""
        })

        // 菜单激活回调函数。将当前激活菜单index存入本地缓存，刷新页面后也可激活前面选中菜单
        function Select(index) {
            localStorage.setItem('menuidex',JSON.stringify(index))     
        }

        // 首次进入时值置为“1-1”
        const ac_index = ref("")
        onMounted(()=>{
            const menuindex = JSON.parse(localStorage.getItem('menuidex'))
            if (menuindex == null) {
                ac_index.value = "1-1"
            } else {
                ac_index.value = menuindex
            }
            
            config.userRole = localStorage.getItem("role")
            config.userName = localStorage.getItem("username")
            
        })

        const logout = () => {
            localStorage.removeItem('menuidex')
            localStorage.removeItem('token')
            localStorage.removeItem('role')
            localStorage.removeItem('userid')
            window.location.href = '/'
        }

        const menu = reactive(menuArr)
        return {
            menu, 
            ac_index, 
            Select,
            logout,
            ...toRefs(config),
            ArrowDown
        }
    }
}
</script>