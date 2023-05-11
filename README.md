# 巨量数据爬取工具

### client -- 客户端 
使用React with TypeScript 通过api获取爬取内容并显示 localhost:3000
### server -- 服务端 
使用Node.js 登录巨量网站验证及爬取数据脚本 通过api发送数据 localhost:8000

> node -v 16

### 使用方法:
`npm i`
#### 1. 启动服务端 -
`cd server`

`npm start`

爬取数据脚本会自动运行, 完成后会自动启动服务器

#### 2. 启动客户端 -
`cd client`

`npm start`

在服务端启动后, 点击Crawler会自动请求数据并做简单展示

**.env文件中设置已有的登录邮箱, 密码和Chrome启动地址, 通过process.env来调用**

### 爬取数据流程
```flow
st=>start: 启动服务器
op=>operation: 登录验证
cond=>condition: 验证成功 Yes or No?
e=>end: 爬取数据

st->op->cond
cond(yes)->e
cond(no)->op
```
### Issue
**巨量引擎登录需要滑动验证或图片验证, 自动化登录准确率并不高, 需要手动验证**
**且验证码自动化无法规避, 故设置了等待时间让用户手动验证**
个人测试账号没有绑定任何组织, 数据完整性待完善

### 开源工具
puppeteer - 通过DevTool协议来控制Chrome
Rembrandt - 用于滑动验证, 从左到右滑动滑块, 比较图片找到相似度最低的移动坐标, 然后移动滑块验证

### Todo
1. 完善登录验证
2. 优化前端页面

#### Node-Canvas似乎不支持ARM芯片, 需要单独安装 [解决办法](https://github.com/Automattic/node-canvas/wiki#installation-guides)
