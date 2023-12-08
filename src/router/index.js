import {createRouter,createWebHashHistory} from 'vue-router'

const routes = [
    // 登录页面
    {
        path: '/',
        name: 'login',
        component: ()=>import(/*webpackChunkName:'Login'*/ '@/page/login/login')
    },
    // 主页面
    {
        path: '/index',
        name: 'index',
        component: ()=>import(/*webpackChunkName:'Index'*/ '@/page/index/index'),
        redirect: '/server',
        children: [
            // 物理机页面
            {
                path: '/server',
                name: 'server',
                component: ()=>import(/*webpackChunkName:'Server'*/ '@/page/resource/server/server')
            },
            // 虚拟机页面
            {
                path: '/vm',
                name: 'vm',
                component: ()=>import(/*webpackChunkName:'Vm'*/ '@/page/resource/vm/vm')
            },
            // 网络设备页面
            {
                path: '/networks',
                name: 'networks',
                component: ()=>import(/*webpackChunkName:'Networks'*/ '@/page/resource/networks/networks')
            },
            // 资源分组页面
            {
                path: '/tag',
                name: 'tag',
                component: ()=>import(/*webpackChunkName:'Tag'*/ '@/page/resource/tag/tag')
            },
            // 系统-用户管理页面
            {
                path: '/user',
                name: 'user',
                component: ()=>import(/*webpackChunkName:'User'*/ '@/page/system/user')
            }
        ]
    },
    {
        path: '/webssh',
        name: 'webssh',
        component: ()=>import(/*webpackChunkName:'Webssh'*/ '@/page/webssh/webssh')
    },

]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router