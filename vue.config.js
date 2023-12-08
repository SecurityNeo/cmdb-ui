const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8080,
    proxy: {
      '/api': { 
        target: 'http://10.210.20.33:18080',
        changeOrigin: true, 
        pathRewrite: {
          '^/api': '/api'
          }
      }
    }
  },
})
