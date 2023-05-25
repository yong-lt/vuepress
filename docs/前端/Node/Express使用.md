---
title: Express使用教程
date: "2023-05-16"
tags:
    - Node
categories:
    - Node
---

::: tip 本文说明

Express 使用教程，适合新手阅读
:::

<!-- more -->

## Express

本身是极简的，仅仅提供了开发的基础功能，但是可以通过中间件的方式集成了很多外部插件来处理 HTTP 请求，对于前端的同学，可以说是非常的简单易学，学习成本极低，只要掌握一些`Node`基础模块，就能很快上手

-   `body-parser`：解析 HTTP 请求头
-   `compression`：压缩 HTTP 请求
-   `cookie-parser`：解析 cookie 数据
-   `cors`：处理跨域资源
-   `morgan`：HTTP 请求日志记录

`Expree`不对`Node`已有的特性进行二次抽象，只是在后者上扩展了 web 应用所需的基本功能

-   内部使用的还是`http`模块
-   请求对象继承自`http.IncomingMessage`
-   响应对象继承自`http.ServerResponse`

应用场景

-   传统 Web 网站
-   接口服务
-   开发工具
    -   JSON Server
    -   webpack-dev-server

相关链接

-   [Express 官网]([Express - Node.js web application framework (expressjs.com)](https://expressjs.com/))
-   [Express 中文网]([Express - 基于 Node.js 平台的 web 应用开发框架 - Express 中文文档 | Express 中文网 (expressjs.com.cn)](https://www.expressjs.com.cn/))
-   [Express Github]([GitHub - expressjs/expressjs.com](https://github.com/expressjs/expressjs.com))
-   [awesome-express]([GitHub - wabg/awesome-express: 这个仓库主要是收集 Express 好用的中间件、新闻资讯、网站等，这是我在基于 Express 开发 web 应用过程中搜集到的一些插件和看到的一些好的内容。](https://github.com/wabg/awesome-express))

## 起步

### 创建项目

```js
npm init -y
npm i express
```

在项目根目录创建一个`app.js`文件

```js
const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("服务器已启动");
});

app.listen(3000, () => console.log("Server running at http://localhost:3000/"));
```

### 路由基础

```js
// app.js
app.get("/", (req, res) => {
    res.send("这是一个GET请求");
});

app.post("/", (req, res) => {
    res.send("这是一个POST请求");
});
```

当然也可以将路由单独提取出来

```js
// routers/user.js
const express = require("express");

const userRoute = express.Router();

userRoute.post("/login", (req, res) => {
    res.send({
        code: 200,
        data: {},
        msg: "登录成功",
    });
});

module.exports = userRoute;
```

```js
// app.js
const express = require("express");
const userRoute = require("./routers/user");

const app = express();

app.use(userRoute);

app.listen(3000, () => console.log("Server running at http://localhost:3000/"));
```

### 请求对象

该对象是继承自`http.IncomingMessage`，所以在`Express`也是能使用一些属性，当然`Express`也在原生基础上做了扩展。相关文档链接：[Node.js](https://nodejs.org/docs/latest-v16.x/api/http.html#class-httpincomingmessage)，[Express](https://expressjs.com/en/4x/api.html#req.baseUrl)

```js
app.get("/", (req, res) => {
    // req.url 请求地址
    // req.method 请求方法
    // req.headers 请求头
    // req.body post 请求主体
    // req.query get 查询参数
});
```

### 响应对象

该对象是继承自`http.ServerResponse`，所以在`Express`也是能使用一些属性，当然`Express`也在原生基础上做了扩展。相关文档链接：[Node.js]([HTTP | Node.js v16.20.0 Documentation (nodejs.org)](https://nodejs.org/docs/latest-v16.x/api/http.html#class-httpserverresponse))，[Express]([Express 4.x - API Reference (expressjs.com)](https://expressjs.com/en/4x/api.html#res))

```js
app.get("/", (req, res) => {
    // res.statusCode = 201 设置响应状态码
    // res.end() 结束响应，可以不需要发送数据
    // res.send() 发客户端发送数据
    // res.status(200).send({name: "a"}) express 可以链式调用
});
```

### 中间件

#### 示例

例如打印日志，需要每个一接口都需要去打印，必然很繁琐

```js
const express = require("express");

const app = express();

app.get("/", (req, res) => {
    console.log(req.method, req.url, Date.now());
    res.send("get /");
});

app.post("/list", (req, res) => {
    console.log(req.method, req.url, Date.now());
    res.send("post /list");
});

app.listen(3000, () => console.log("Server running at http://localhost:3000/"));
```

现在可以使用中间件就可以解决这个问题

```js
const express = require("express");

const app = express();
// 在所有的请求到达服务器，都需要经过此中间件
app.use((req, res, next) => {
    console.log(req.method, req.url, Date.now());
    // 中间件处理完成，需要放行，交给下面的路由
    next();
});

app.get("/", (req, res) => {
    res.send("get /");
});

app.post("/list", (req, res) => {
    res.send("post /list");
});

app.listen(3000, () => console.log("Server running at http://localhost:3000/"));
```
