

## 项目源码初始地址

| 项目 | Gitee   | Github    | GitCode|
| ---- | ----| ---- | ---- | 
| 前端 | [vue3-element-admin](https://gitee.com/youlaiorg/vue3-element-admin) | [vue3-element-admin](https://github.com/youlaitech/vue3-element-admin) | [vue3-element-admin](https://gitcode.com/youlai/vue3-element-admin) |
| 精简版 | [vue3-element-admin-thin](https://gitee.com/cshaptx4869/vue3-element-admin-thin) | [vue3-element-admin-thin](https://github.com/youlaitech/vue3-element-admin-thin) |-|
| 后端 | [youlai-boot](https://gitee.com/youlaiorg/youlai-boot)       | [youlai-boot](https://github.com/haoxianrui/youlai-boot.git) |[youlai-boot](https://gitcode.com/youlai/youlai-boot.git)|

## 环境准备

| 环境                 | 名称版本                                                     | 下载地址                                                     |
| -------------------- | :----------------------------------------------------------- | ------------------------------------------------------------ |
| **开发工具**         | VSCode    | [下载](https://code.visualstudio.com/Download)           |
| **运行环境**         | Node ≥18 (其中 20.6.0 版本不可用)    | [下载](http://nodejs.cn/download)                        |


## 项目部署

```bash
# 项目打包
pnpm run build

# 上传文件至远程服务器
将本地打包生成的 dist 目录下的所有文件拷贝至服务器的 /usr/share/nginx/html 目录。

# nginx.cofig 配置
server {
	listen     80;
	server_name  localhost;
	location / {
			root /usr/share/nginx/html;
			index index.html index.htm;
	}
	# 反向代理配置
	location /prod-api/ {
      # api.youlai.tech 替换后端API地址，注意保留后面的斜杠 /
      proxy_pass http://api.youlai.tech/; 
	}
}
```

## 本地Mock

项目同时支持在线和本地 Mock 接口，默认使用线上接口，如需替换为 Mock 接口，修改文件 `.env.development` 的 `VITE_MOCK_DEV_SERVER` 为  `true` **即可**。
