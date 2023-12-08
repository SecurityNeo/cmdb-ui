<template>
  <div>
      <div style="text-align: center;margin-top: 50px;" v-show="!source">
          <el-form ref="formRef" :model="formData" :rules="rules" status-icon label-position="left" label-width="80px" style="margin-left: 50vh; width: 50vh">
            <el-form-item label="IP地址" prop="ip">
              <el-input v-model="formData.ip"/>
            </el-form-item>
            <el-form-item label="端口号" prop="port">
              <el-input v-model="formData.port"/>
            </el-form-item>
            <el-form-item label="用户名" prop="user">
              <el-input v-model="formData.user"/>
            </el-form-item>
            <el-form-item label="密码" prop="pwd">
              <el-input v-model="formData.pwd" type="password" show-password/>
            </el-form-item>
            <el-form-item>
              <el-button id="connect" type="primary" :loading="isLoading" @click="submitForm(formRef)">连接</el-button>
              <el-button @click="resetForm(formRef)">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="ssh-container" ref="terminal" v-show="source === 'other'"></div>

  </div>
</template>

<script>
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'
import { debounce } from 'lodash'
import { getCurrentInstance, reactive,onBeforeUnmount,onUnmounted,onMounted, toRefs,ref  } from 'vue'
import { useRoute } from 'vue-router';

export default {
  setup() {
    const route = useRoute()
    const terminal = ref()

    const formRef = ref()

    // 实现按下键盘回车触发login
    // 键盘事件：keyDown（键盘按键按下时触发）
    
    const keyDown = (e) => {
        // 13 为控制键键码对应的Enter,108为数字键盘对应的Enter。
        if (e.keyCode == 13 || e.keyCode == 108) {
          document.getElementById('connect').click();
        }
    }     
    
    const formData = reactive( {
        user: 'root',
        pwd: '',
        ip: '',
        port: '22',
    })
    const rules = {
        ip: [
            { required: true, message: 'IP地址不能为空', trigger: 'blur' },
            { pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,message: '请输入正确IPV4地址',trigger: 'blur'}
        ],
        port: [
            { required: true, message: '端口号不能为空', trigger: 'blur' },
            { pattern: /^\d*\.?\d+$/,message: '请输入正确端口号',trigger: 'blur'}
        ],
        user: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        pwd: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
    }

    onBeforeUnmount(()=>{
      removeResizeListener()
      config.term && config.term.dispose()
      config.ws.send(JSON.stringify({
        type: 'stdin',
        data: utf8_to_b64('exit')
      }))
    })

    onUnmounted(()=>{
      window.removeEventListener('keydown', keyDown, false);
      config.ws.send(JSON.stringify({
          type: 'stdin',
          data: utf8_to_b64('exit')
        }))
    }) 

    onMounted(()=>{
      
      window.addEventListener('keydown', keyDown);
      config.source = route.query.source
      config.type = route.query.type
      config.id = route.query.id

      if (config.source === 'plat') {
        if (config.type === 'vm') {
          // 调用虚拟机详情接口查询登录信息
          getVmDetail()
          console.log(formData);
          // 跳转过来不用再校验，直接登录
          // config.isLoading = true
          // initWs()    
            
        } else if ( config.type === 'server') {
          // 调用物理机详情接口查询登录信息
          getServerDetail()
          // 跳转过来不用再校验，直接登录
          config.isLoading = true
          initWs() 
        }
      }    
    })
    
    const {proxy} = getCurrentInstance()
    
    const packResize = (cols, rows) =>
      JSON.stringify({
        type: 'resize',
        cols: cols,
        rows: rows
    })

    const config = reactive({
      id: 0,
      source: 'other',
      type: '',
      isLoading: false,
      initText: '正在努力连接中...\r\n',
      first: true,
      term: null,
      fitAddon: null,
      ws: null,
      socketUrl: proxy.$urls.m().ws,
      option: {
        lineHeight: 1.0,
        // 光标闪烁
        cursorBlink: true,
        // 光标样式 'block' | 'underline' | 'bar'
        cursorStyle: 'block', 
        // 字体大小
        fontSize: 15,
        // fontcolor: '#000000',
        fontFamily: "Monaco, Menlo, Consolas, 'Courier New', monospace",
        theme: {
          // 背景色
          background: '#002833',
          // 前景色
          foreground: '#14e264',
          // 光标背景色
          cursor: 'help',
          // 光标前景色
          /** The accent color of the cursor (fg color for a block cursor) */
          // cursorAccent: '#000000',
          // 选择背景色
          /** The selection background color (can be transparent) */
          selection: '#0000ff',
          // 选择前景色
          /** The selection foreground color */
          selectionForeground: '#0000ff'
        },
        cols: 30 // 初始化的时候不要设置fit，设置col为较小值（最小为可展示initText初始文字即可）方便屏幕缩放
      }
    })

    const initWs = ()=> {
        initTerm()
        initSocket()
        onTerminalResize()
        onTerminalKeyPress()
    }

    const submitForm = (formRef)=> {
      //config.activeName = 'second'
      formRef.validate((valid, fields) => {
        if(valid) {
          config.isLoading = true
          initWs()
        }
      })
    }

    const resetForm = (formName)=> {
        formName.value.resetFields();
    }

    const handleClick = (tab, event)=> {
        if (tab.name === 'second') {
          // this.init()
        }
    }

    function utf8_to_b64(rawString) {
        return btoa(unescape(encodeURIComponent(rawString)));
    }

    function b64_to_utf8(encodeString) {
        return decodeURIComponent(escape(atob(encodeString)));
    }

    function  bytesHuman(bytes, precision) {
        if (!/^([-+])?|(\.\d+)(\d+(\.\d+)?|(\d+\.)|Infinity)$/.test(bytes)) {
          return '-'
        }
        if (bytes === 0) return '0';
        if (typeof precision === 'undefined') precision = 1;
        const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB'];
        const num = Math.floor(Math.log(bytes) / Math.log(1024));
        const value = (bytes / Math.pow(1024, Math.floor(num))).toFixed(precision);
        return `${value} ${units[num]}`
    }

    function isWsOpen() {
        return config.ws && config.ws.readyState === 1
    }
    
    const initTerm = ()=> {
        config.term = new Terminal(config.option)
        config.fitAddon = new FitAddon()
        config.term.loadAddon(config.fitAddon)
        config.term.open(terminal.value)
        // config.fitAddon.fit() // 初始化的时候不要使用fit
        setTimeout(() => {
          config.fitAddon.fit()
        }, 500); // 必须延时处理
    }

    function onTerminalKeyPress() {
        config.term.onData(data => {
          isWsOpen() && config.ws.send(JSON.stringify({
            type: 'stdin',
            data: utf8_to_b64(data)
          }))
        })
    }

    function resizeRemoteTerminal() {
        const { cols, rows } = config.term
        console.log('列数、行数设置为：', cols, rows)
        // 调整后端终端大小 使后端与前端终端大小一致
        isWsOpen() && config.ws.send(packResize(cols, rows))
      }
    
    const onResize = debounce(function () {
        config.fitAddon.fit()
      }, 100)
  
    function onTerminalResize() {
        window.addEventListener('resize', onResize)
        config.term.onResize(resizeRemoteTerminal)
    }

    function removeResizeListener() {
        window.removeEventListener('resize', onResize)
    }

    const initSocket = ()=> {
        config.term.write(config.initText)
        console.log(config.socketUrl)
        config.ws = new WebSocket(config.socketUrl,['webssh'])
        onOpenSocket()
        onCloseSocket()
        onErrorSocket()
        config.term._initialized = true
        onMessageSocket()
    }

    const onOpenSocket = ()=> {
        config.ws.onopen = () => {
          console.log('websocket 已连接')
          config.ws.send(JSON.stringify({ type: "addr", data: utf8_to_b64(formData.ip + ':' + formData.port) }));
          // socket.send(JSON.stringify({ type: "term", data: utf8_to_b64("linux") }));
          config.ws.send(JSON.stringify({ type: "login", data: utf8_to_b64(formData.user) }));
          config.ws.send(JSON.stringify({ type: "password", data: utf8_to_b64(formData.pwd) }));
          config.term.reset()
          setTimeout(() => {
            resizeRemoteTerminal()
          }, 500)
        }
    }

    const onCloseSocket =()=> {
        config.ws.onclose = () => {
          console.log('关闭连接')
          config.source = 'other'
          config.term.write('连接关闭!\r\n请检查账号密码后刷新页面后重新连接！\r\n');
        }
    }
    
    const onErrorSocket =()=> {
        config.ws.onerror = () => {
          config.source = 'other'
          config.term.write('连接失败!\r\n请检查账号密码后刷新页面后重新连接！\r\n')
        }
    }

    const onMessageSocket = ()=> {
        config.ws.onmessage = res => {
          console.log(res)
          config.source = 'other'
          const msg = JSON.parse(res.data)
          const term = config.term
          // console.log("receive: " + data)
          // 第一次连接成功将 initText 清空
          if (config.first) {
            config.first = false
            term.reset()
            term.element && term.focus()
            resizeRemoteTerminal()
          }
          term.write(b64_to_utf8(msg.data))
        }
    }


    const getVmDetail = async()=> {
        try {
            await new proxy.$request(proxy.$urls.m().vmdetail + "?id=" + config.id).modeget()
            .then(rest=>{
                if (rest.data.code !== 200 ) {
                  new proxy.$tips("获取虚拟机详情失败", "warning").notify()
                }
                formData.ip = rest.data.data.mgt_ip
                formData.pwd =  rest.data.data.mgt_root_pwd
                document.getElementById('connect').click();
                
            })
                  
        } catch (e) {
            console.log(e);
            if (e.code !== 401) {
                new proxy.$tips("服务器错误，请稍后重试", "error").notify()
            }     
        }
    }

    const getServerDetail = async()=> {
        try {
            await new proxy.$request(proxy.$urls.m().serverdetail + "?id=" + config.id).modeget()
            .then(rest=>{
              if (rest.data.code !== 200 ) {
                  new proxy.$tips("获取服务器详情失败", "warning").notify()
                }
                formData.ip = rest.data.data.mgt_ip
                formData.pwd =  rest.data.data.mgt_root_pwd  
            })           
        } catch (e) {
            console.log(e);
            if (e.code !== 401) {
                new proxy.$tips("服务器错误，请稍后重试", "error").notify()
            }     
        }
    }

    return {
      ...toRefs(config),
      formData,
      submitForm,
      resetForm,
      handleClick,
      terminal,
      getVmDetail,
      rules,
      formRef
    }

  }
}

</script>
<style lang="scss">
body {
  margin: 0;
  padding: 0;
}

.ssh-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  height: 100vh;
  border-radius: 4px;
  background: #002833;
  padding: 0px;
  //color: rgb(0, 0, 0);

  .xterm-scroll-area::-webkit-scrollbar-thumb {
    background-color: #b7c4d1;
    /* 滚动条的背景颜色 */
  }
}
</style>