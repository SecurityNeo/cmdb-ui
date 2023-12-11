const ip = "10.210.20.33"
const port = "18080"
const url = `http://${ip}:${port}`

const urls = class {
    static m() {

        const ws = `ws://${ip}:${port}/api/v1/webssh/ssh`

        const login = `${url}/api/v1/login`
        const userlist = `${url}/api/v1/user/list`
        const userdelete = `${url}/api/v1/user/delete`
        const useradd = `${url}/api/v1/user/add`
        const userupdate = `${url}/api/v1/user/update`
        const userpwdupdate = `${url}/api/v1/user/pwd/update`

        const serverlist = `${url}/api/v1/resource/host/list`
        const serseradd = `${url}/api/v1/resource/host/add`
        const serverupdate = `${url}/api/v1/resource/host/update`
        const serverdelete = `${url}/api/v1/resource/host/delete`
        const serverdetail = `${url}/api/v1/resource/host/detail`

        const vmlist = `${url}/api/v1/resource/vm/list`
        const vmadd = `${url}/api/v1/resource/vm/add`
        const vmupdate = `${url}/api/v1/resource/vm/update`
        const vmdelete = `${url}/api/v1/resource/vm/delete`
        const vmdetail = `${url}/api/v1/resource/vm/detail`

        const networkslist = `${url}/api/v1/resource/netdevice/list`
        const networksadd = `${url}/api/v1/resource/netdevice/add`
        const networksupdate = `${url}/api/v1/resource/netdevice/update`
        const networksdelete = `${url}/api/v1/resource/netdevice/delete`

        const interfacetopologydetail = `${url}/api/v1/resource/netdevice/interfacetopology/detail`
        const interfacetopologyadd = `${url}/api/v1/resource/netdevice/interfacetopology/add`
        const interfacetopologyupdate = `${url}/api/v1/resource/netdevice/interfacetopology/update`
        const interfacetopologyDeleteBySrcId = `${url}/api/v1/resource/netdevice/interfacetopology/srcdevice/delete`

        const tagList = `${url}/api/v1/pub/tag/list`
        const tagAdd = `${url}/api/v1/pub/tag/add`
        const tagUpdate = `${url}/api/v1/pub/tag/update`
        const tagDelete = `${url}/api/v1/pub/tag/delete`

        return {
            ws,
            login,
            userlist,
            userdelete,
            useradd,
            userupdate,
            userpwdupdate,
            serverlist,
            serverdetail,
            tagList,
            tagAdd,
            tagUpdate,
            tagDelete,
            serseradd,
            serverupdate,
            serverdelete,
            vmlist,
            vmadd,
            vmupdate,
            vmdelete,
            vmdetail,
            networkslist,
            networksadd,
            networksupdate,
            networksdelete,
            interfacetopologydetail,
            interfacetopologyadd,
            interfacetopologyupdate,
            interfacetopologyDeleteBySrcId
        }
    }
}
export default urls