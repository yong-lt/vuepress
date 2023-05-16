---
title: 面试常见问题
date: "2023-05-16"
tags:
    - JavaScript
    - Vue
    - React
categories:
    - 面试
---

::: tip 本文说明

积累面试过程中，一些面试问题，以及在工作中常见的问题
:::

<!-- more -->

## var,let,const 的区别

-   var 声明的变量有变量提升的特性，而 let、const 也会有，但是会有暂时性死区，在提升处与声明处是不能访问该变量
-   var 声明的变量会挂载到 windows 对象上，所以使用 var 声明的是全局变量，而 let 和 const 声明的变量是局部变量, 块级作用域外不能访问
-   const 声明的是常量，一旦声明不能再次赋值修改，如果声明的是复合类型数据，可以修改其属性

## js 中的基础数据类型有哪几种? 了解包装对象吗？

-   六种，string, number, boolean, undefiend, null, symbol
-   基础数据类型临时创建的临时对象，称为包装对象。其中 number、boolean 和 string 有包装对象，代码运行的过程中会找到对应的包装对象，然后包装对象把属性和方法给了基本类型，然后包装对象被系统进行销毁。

## ES6

-   字符模板串
-   函数的默认参数，剩余参数
-   箭头函数
-   展开运算符
-   symbol
-   解构赋值 —— 拥有迭代器才能使用
-   Map 和 Set
-   class
-   模块导入导出 —— import export
-   Promise

## Symbol

### 使用 Symbol 来作为对象属性名(key)

```js
// 使用Object的API
Object.getOwnPropertySymbols(obj); // [Symbol(name)]

// 使用新增的反射API
Reflect.ownKeys(obj); // [Symbol(name), 'age', 'title']
```

### 使用 Symbol 来替代常量

```js
const TYPE_AUDIO = Symbol();
const TYPE_VIDEO = Symbol();
const TYPE_IMAGE = Symbol();
```

### 使用 Symbol 定义类的私有属性/方法

```js
const PASSWORD = Symbol();

class Login {
    constructor(username, password) {
        this.username = username;
        this[PASSWORD] = password;
    }

    checkPassword(pwd) {
        return this[PASSWORD] === pwd;
    }
}

export default Login;
```

## Set

### 地实现并集（Union）、交集（Intersect）和差集（Difference）

```js
let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);

// 并集
let union = new Set([...a, ...b]);
// Set {1, 2, 3, 4}

// 交集
let intersect = new Set([...a].filter(x => b.has(x)));
// set {2, 3}

// （a 相对于 b 的）差集
let difference = new Set([...a].filter(x => !b.has(x)));
// Set {1}
```

### 去重

```js
// 去除数组的重复成员
[...new Set(array)]

[...new Set('ababbc')].join('')
// "abc"
```

## call apply bind 的作用与区别？

### 作用

改变函数内部 this 的指向

### 区别

-   call 和 apply 会调用函数，而 bind 不会调用
-   call 和 bind 的参数是 参数列表逐个传入，而 apply 的参数必须为数组形式

### 手写 bind

```js
Function.prototype.myBind = function (ctx) {
    const _this = this;
    const data = Array.from(arguments).slice(1);

    const obj = typeof ctx === "object" ? ctx : new ctx.constructor(ctx);

    Object.defineProperty(obj, "fn", {
        get() {
            return _this;
        },
    });

    return function () {
        return obj.fn(...data);
    };
};

function a(a, b) {
    console.log(this, a, b);
}

const newFn = a.myBind(NaN, 1, 2);

console.log(newFn());
```

## 宏任务，微任务

异步任务分为 宏任务 和 微任务

### 宏任务

-   常见的宏任务：settimeout setInterval script(最外层的 script 标签), requestAnimationFrame
-   会压入到调用栈中，宏任务会等到调用栈清空之后再执行

### 微任务

-   常见的微任务：promise (async await)
-   会在调用栈清空时立即执行(优先级大于宏任务), 调用栈中加入的微任务会立马执行

### 总结

1. 同一作用域微任务队列优先于宏任务队列执行，
2. 微任务队列上创建的宏任务会被后添加到当前宏任务队列的尾端，微任务队列中创建的微任务会被添加到微任务队列的尾端。
3. 只要微任务队列中还有任务，宏任务队列就只会等待微任务队列执行完毕后再执行

### new 操作符具体干了什么

1. 创建一个空的简单 JavaScript 对象（即 **`{}`**）；
2. 为步骤 1 新创建的对象添加属性 **`__proto__`**，将该属性链接至构造函数的原型对象；
3. 将步骤 1 新创建的对象作为 **`this`** 的上下文；
4. 如果该函数没有返回对象，则返回 **`this`**。

## 原型，原型链 ? 有什么特点？

### 原型

-   原型分为隐式原型(**proto**) 和 显式原型(prototype)，每个对象都有它的隐式原型(**proto**)，指向它对应构造函数的显式原型(prototype)
-   无论何时，只要创建一个函数，就会为这个函数添加一个 prototype 属性，这个属性就指向原型对象
-   构造函数的 prototype 指向原型对象，原型对象有一个 constructor 属性指回构造函数，每个构造函数生成的实例对象都有一个 **proto** 属性，这个属性也指向原型对象。

### 原型链

-   每个对象都有 **proto** 属性，这个属性指向原型对象，当想访问对象的一个属性时，如果这个对象本身没有这个属性就会通过 **proto**属性 查找，原型对象也是对象，每个对象又有自己的 **proto** 属性，所以就会一直这样查找上去，直到找到这个属性，这就是原型链的概念。
-   原型链就是对象沿着 **proto** 这条链逐步向上搜索，最顶层是 Object，Object 的 **proto** 是 null。

## 防抖和节流的作用

### 防抖

高频的触发事件，规定时间内触发会被清除，只有当超过规定时间触发，然后执行最后一次事件

```js
function debounce(fn, delay) {
    let timer = null;
    return function () {
        // 函数内部能访问外面的 变量timer，所以是一个 闭包
        if (timer) {
            // timer 有值说明有任务正在运行，清除掉执行新的任务
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn();
            // delay 定义超过多少时间不调用才执行事件
        }, delay);
    };
}
```

### 节流

高频的触发事件，限制触发次数，规定时间内只能触发一次

## 移动端适配 1px 的问题

伪元素 + transfrom

```css
.border-top {
    position: relative;
}

.border-top::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    border-top: 1px solid #000;
    transform: scaleY(0.5);
    transform-origin: left top;
}
```

## css 垂直居中

-   使用绝对定位+transform
-   使用 flex 布局
-   绝对定位和 margin: auto

## Object.defineProperty()

Object.defineProperty(obj, prop, descriptor)

-   obj：要定义属性的对象
-   prop：要定义或修改的属性的名称
-   descriptor：要定义或修改的属性描述符
    -   configurable(数据描述符)：为 `true` 时，该属性的描述符才能够被改变，同时该属性也能从对应的对象上被删除。 **默认为** **`false`**。
    -   enumerable(数据描述符)：为 `true` 时，该属性才会出现在对象的枚举属性中。 **默认为 `false`**
    -   value(数据描述符)：该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）。 **默认为 [`undefined`]**
    -   writable(数据描述符)：为 `true` 时，属性的值，也就是上面的 `value`，才能被赋值运算符 改变。 **默认为 `false`。**
    -   get(存取描述符)
    -   set(存取描述符)
-   数据描述符和存取描述符不能混合使用

## 深拷贝

```js
function copy_obj(obj) {
    if (obj.constructor == Array) {
        var new_obj_list = [];
        for (var i = 0; i < obj.length; i++) {
            var item = obj[i];
            new_obj_list.push(copy_obj(item));
        }
        return new_obj_list;
    } else if (obj.constructor == Number || obj.constructor == String) {
        var num = obj;
        return num;
    } else {
        // return $.extend(true, {}, obj);
        return $.extend({}, obj);
    }
}
```

## 回流与重绘

### 回流

当渲染树(Render Tree)中部分或全部元素的尺寸、结构、或某些属性发生改变时，浏览器重新渲染部分或全部文档的过程称为回流，比如以下操作就会导致浏览器发生回流：

-   添加或删除可见的 DOM 元素
-   元素的位置发生变化
-   元素的尺寸发生变化（包括外边距、内边框、边框大小、高度和宽度等）
-   内容发生变化，比如文本变化或图片被另一个不同尺寸的图片所替代。
-   页面一开始渲染的时候（这肯定避免不了）
-   浏览器的窗口尺寸变化（因为回流是根据视口的大小来计算元素的位置和大小的）
-   激活 CSS 伪类（例如:常用的:hover）
-   查询某些属性或调用某些方法

### 重绘

简单一句话：就是当一个元素的外观发生改变，但没有改变布局,对页面布局没有任何的影响，重新把元素外观绘制出来的过程，叫做重绘。例如：只是对 color、background-color、visibility 等这类属性操作。

由此可见，回流一定会发生重绘。但重绘不一定会触发回流。

### 性能影响

**回流比重绘的代价要更高。**

有时即使仅仅回流一个单一的元素，它的父元素以及任何跟随它的元素也会产生回流。

### 浏览器的渲染队列

每一次都改变了元素的几何属性，实际上最后只触发了一次回流，这都得益于浏览器的**渲染队列机制**，它会把该操作放进渲染队列，等到队列中的操作到了**一定的数量或者到了一定的时间间隔时**，浏览器就会批量执行这些操作。在 console 中你请求的这几个样式信息，无论何时浏览器都会立即执行渲染队列的任务，即使该值与你操作中修改的值没关联。

## ==比较

-   特殊

```js
undefined == null; // true
NaN == NaN; // false
```

-   类型相同：比较值大小

-   类型不同

    -   均为原始：转换为数字比较

    ```js
    1 == "1"; // true
    1 == true; // true
    2 == true; // fals
    ```

    -   一端原始，一端对象：对象转原始后比较。先调用 valueOf()，若无法转换成原始值，调用 toString()

    ```js
    const obj = {};
    console.log(obj.valueOf()); // 对象本身
    console.log(obj.toString()); // [object Object]
    console.log(obj == 1); // false
    console.log(obj == "[object Object]"); // true

    //重写 valueOf()
    obj.valueOf = function () {
        return 1;
    };
    console.log(obj == 1); // true

    const arr = [1, 2, 3];
    console.log(arr.valueOf()); // 数组本身 [1,2,3]
    console.log(arr.toString()); // ‘1,2,3’
    console.log(arr == "1,2,3"); // true
    ```

## canvas

```js
// 生成一个canvas
renderCanvas() {
    const canvas = document.createElement("canvas")
    canvas.width = 100
    canvas.height = 100
    // 获取上下文
    const ctx = canvas.getContext("2d")
    // 如果需要插入图片
    const img = new Image()
    img.setAttribute('crossOrigin', 'Anonymous');
    img.onload = function() {
        ctx.drawImage(img, 0, 0)
        ctx.fillStyle = "#fff"
        ctx.font = "700 36px sans-serif"
        ctx.fillText('其他文本', 70, 390);
    }
    img.src = 'xxx'
},
// 保存 canvas 为图片
savaCanvas() {
    // 使用 toDataURL 获取 canvas base64图片
    const url = canvas.toDataURL("image/png")
    const dowimg = document.createElement("a")
    dowimg.download = new Date().getTime();
    dowimg.href = url
    dowimg.click()
}
```

### 多端实现

![img](https://img.toutiao.io/c/81f94fe451e4cce27e3c94dc279c133d)

## 滚动加载

```js
const loading = document.querySelector(".loading");

const ob = new IntersectionObserver(
    function (entries) {
        // entries 观察 dom 的数组
        const entry = entries[0];
        if (entry.isIntersecting) {
            // 加载数据函数
        }
    },
    {
        // root: 不写为浏览器可视窗口
        threshold: 0.5, // 重叠多少,去触发第一个函数的执行
    }
);

// 观察某个 dom
// ob.observe(dom)
ob.observe(loading);
```

## for in 与 for of

-   for..in 遍历对象，遍历可迭代对象往往是下标
-   for...of 遍历可迭代对象

## 判断对象中是否存在某个属性

```js
/**
 * 判断对象是否存在某个属性
 * @param {Object} obj 对象
 * @param {String} key 属性
 * @returns
 */
// in 可以查询到原型链上的属性
function hasProperty(obj, key) {
    return key in obj;
}
```

## 函数二义性

调用函数时，通过判断`new.target`是否有值，确定是否是`new`调用

## 并发请求

```js
function concurRequest(urls, maxNum) {
    return new Promise(resolve => {
        if (!urls.length) {
            resolve([]);

            return;
        }

        const result = [];
        let index = 0;
        let count = 0;

        async function request() {
            if (index === urls.length) {
                return;
            }
            const i = index;
            const url = urls[index];
            index++;
            try {
                const res = await axios.get(url);
                result[i] = res;
            } catch (error) {
                result[i] = error;
            } finally {
                count++;
                if (count === urls.length) {
                    resolve(result);
                }
                request();
            }
        }

        const time = Math.min(urls.length, maxNum);

        for (let i = 0; i < time; i++) {
            request();
        }
    });
}
```

## 请求取消

```js
let controller;
input.oninput = async () => {
    // 取消之前的请求
    controller && controller.abort();
    controller = new AbortController();
    const list = await fetch(url, {
        signal: controller.signal,
    }).then();
};
```

## 请求头 Content-Type

-   application/json：JSON

-   multipart/form-data; boundary=-----WebKitFormBoundaryiC4k8nM4YJvrEhtp

    ```js
    ------WebKitFormBoundaryiC4k8nM4YJvrEhtp
    Content-Disposition: form-data; name="file"; filename="0c95481b7cb27f05.jpg"
    Content-Type: image/jpeg

    <二进制>
    ------WebKitFormBoundaryiC4k8nM4YJvrEhtp--
    ```

## 无限递归栈溢出

```js
// 在第一foo的执行期间，定时器中的foo并没有调用，是异步执行，所以会将定时器扔进事件队列，执行完同步，栈内存没有任务，再去任务队列执行下一个foo，循环往复，栈内存始终会清空完，再去队伍队列执行下一次任务
function foo() {
    setTimeout(foo, 0);
}

foo();

// 此时会栈溢出，因为在定时器中，会先执行foo函数，在执行定时器，所以会一直执行foo()，导致栈溢出
function foo() {
    setTimeout(foo(), 0);
}

foo();
```

## 什么是数据响应式

数据变化后，会自动重新运行依赖于该数据的函数

## 为什么需要虚拟 DOM

虚拟 DOM 本质上并没有效率高的表现，最后还是会根据数据生成真实 DOM，反而还会导致效率降低。最主要的两个原因

-   Vue，React 等框架，是一个通用框架，而框架的设计核心理念，就是要把数据跟界面对应起来，当某个数据发生改变，要正确的去更新对应的 DOM。一个数据可以用在不同元素里，可以重复使用，一个元素里面又有多个数据，对应关系非常复杂，作为通用框架，是很难预知数据跟界面如何对应起来，所以采取了粗暴简单的方式，只要数据一变，界面全部重新生成。如果不使用虚拟 DOM，只要数据一变，界面全部重新生成，操作 DOM 代价非常昂贵。所以不得不使用虚拟 DOM，数据变化之后，不知道界面那个地方要更新，既然要全量生成，就不去全量生成真实 DOM，而是全量生成虚拟 DOM，然后通过跟之前的虚拟 DOM 进行比较，找到有差异的 DOM，最后快速定位到真实 DOM 并修改。
-   为了消除平台之间的差异性，DOM 存在于页面应用，而移动端 APP，小程序没有 DOM，于是把界面抽象化表达，使用普通对象来表达 UI 界面，然后根据不同平台，去具体生成真实界面。

## 渲染主线程是如何⼯作的？

解析 HTML，CSS，计算样式，布局，处理图层，每秒画页面 60 次，执行全局 JS 代码，执行事件处理函数，执行定时器回调

## 如何理解 JS 的异步？

JS 是⼀⻔单线程的语⾔，这是因为它运⾏在浏览器的渲染主线程中，⽽渲染主线程只有⼀个。⽽渲染主线程承担着诸多的⼯作，渲染⻚⾯、执⾏ JS 都在其中运⾏。如果使⽤同步的⽅式，就极有可能导致主线程产⽣阻塞，从⽽导致消息队列中的很多其他任务⽆法得到执⾏。这样⼀来，⼀⽅⾯会导致繁忙的主线程⽩⽩的消耗时间，另⼀⽅⾯导致⻚⾯⽆法及时更新，给⽤户造成卡死现象。所以浏览器采⽤异步的⽅式来避免。具体做法是当某些任务发⽣时，⽐如计时器、⽹络、事件监听，主线程将任务交给其他线程去处理，⾃身⽴即结束任务的执⾏，转⽽执⾏后续代码。当其他线程完成时，将事先传递的回调函数包装成任务，加⼊到消息队列的末尾排队，等待主线程调度执⾏。在这种异步模式下，浏览器永不阻塞，从⽽最⼤限度的保证了单线程的流畅运⾏

## 任务有优先级吗

根据 W3C 的最新解释:每个任务都有⼀个任务类型，同⼀个类型的任务必须在⼀个队列，不同类型的任务可以分属于不同的队列。在⼀次事件循环中，浏览器可以根据实际情况从不同的队列中取出任务执⾏。浏览器必须准备好⼀个微队列，微队列中的任务优先所有其他任务执⾏。至少包含微队列（最高），交互队列（高），延时队列（中）。

## JS 的事件循环

事件循环⼜叫做消息循环，是浏览器渲染主线程的⼯作⽅式。在 Chrome 的源码中，它开启⼀个不会结束的 for 循环，每次循环从消息队列中取出第⼀个任务执⾏，⽽其他线程只需要在合适的时候将任务加⼊到队列末尾即可。过去把消息队列简单分为宏队列和微队列，这种说法⽬前已⽆法满⾜复杂的浏览器环境，取⽽代之的是⼀种更加灵活多变的处理⽅式。根据 W3C 官⽅的解释，每个任务有不同的类型，同类型的任务必须在同⼀个队列，不同的任务可以属于不同的队列。不同任务队列有不同的优先级，在⼀次事件循环中，由浏览器⾃⾏决定取哪⼀个队列的任务。但浏览器必须有⼀个微队列，微队列的任务⼀定具有最⾼的优先级，必须优先调度执⾏。

## BFC

它是一块独立的区域，让处于 BFC 内部的元素于外部的元素互相隔离。

### 如何触发

-   position:fixed/absolute
-   float 不为 none
-   overflow 不为 visible
-   display 的值为 inline-block、table-cell、table-caption

### 作用

-   防止 margin 发生重叠
-   两栏布局，防止文字环绕
-   防止元素塌陷

## em 和 rem 的区别

### 区别

-   rem 是相对于根元素进行计算，而 em 是相对于当前元素或父元素的字体大小。
-   rem 不仅可以设置字体的大小，还支持元素宽、高等属性。
-   em 是相对于当前元素或父元素进行换算，层级越深，换算越复杂。而 rem 是相对于根元素计算，避免层级关系。

### rem 特点

-   rem 为元素设定字体大小的时候，是相对于根元素进行计算的。
-   当我们改变根元素下的字体大小时，下面的大小都会改变。
-   通过 rem 既可以做到只修改根元素就可以成比例的调整所有字体，又可以避免字体大小逐层复合的连锁反应。

## HTTP 缓存

使用 HTTP 缓存，通过复用缓存资源，减少了客户端等待时间和网络流量，同时也能缓解服务器端的压力。可以显著的提升我们网站和应用的性能。

### 强缓存

强缓存不会向服务器发送请求，直接从缓存中读取资源，在 chrome 控制台的 network 选项中可以看到该请求返回 200 的状态码，并且 size 显示 from disk cache 或 from memory cache；

### 协商缓存

协商缓存会先向服务器发送一个请求，服务器会根据这个请求的 request header 的一些参数来判断是否命中协商缓存，如果命中，则返回 304 状态码并带上新的 response header 通知浏览器从缓存中读取资源。

## Map 与 Object 的区别

### 区别

-   意外的键：map 只包含显式插入的键。obj 自定义的键可能会与原型链上的键冲突
-   键的类型：map 的键可以是**任意值**，包括函数、对象或任意基本类型。obj 必须是 string 或 symbol
-   键的顺序
-   键的个数：map 可以通过 size 获取。obj 只能手动计算
-   迭代：map 可以被迭代。obj 不能
-   性能：map 最好

## requestAnimationFeame 和 setInterval 的区别

当我们使用 requestAnimationFrame 时，浏览器会在下一次重绘之前调用我们提供的回调函数。回调函数中通常会更新动画的状态，并再次调用 requestAnimationFrame 以便在下一次重绘时更新动画。在每次重绘之前更新动画的状态，并确保动画流畅运行，而不会对浏览器的性能造成影响。setInterval 不会考虑浏览器的重绘，而是按照指定的时间间隔执行回调函数。由于 setInterval 的调用频率不固定，因此在实现动画效果时可能会出现卡顿或者掉帧的情况。

## vue 中的 key 有什么用

key 的作用主要用在 Vue 的虚拟 DOM 算法，给 Vue 一个提示，以便能跟踪每个节点的身份，从而重用和重新排序现有元素，移除 key 不存在的元素（并且根据源码可以看出，在比较新老节点首尾节点交叉进行 sameVnode 比对都不相同时，有 key 后续的比对会更快，通过 map 可以快速定位，不需要去遍历老节点 sameVnode 寻找）。

## 迭代协议

### 可迭代协议

允许 JavaScript 对象定义或定制它们的迭代行为 ，一些内置的可迭代对象，有默认的迭代行为，比如`Array`，

`String`，`Map`，`Set`。

要成为**可迭代**对象，该对象必须实现 **`@@iterator`** 方法，这意味着对象（或者它原型链上的某个对象）必须有一个键为 `@@iterator` 的属性，可通过常量 `Symbol.iterator` 访问该属性：

​ `Symbol.iterator`一个无参数的函数，其返回值为一个符合迭代器协议的对象。

此函数可以是普通函数，也可以是生成器函数，以便在调用时返回迭代器对象。在此生成器函数的内部，可以使用 `yield` 提供每个条目。

```js
{
    [Symbol.iterator]: function() {
        return 迭代器
    }
}

Object.prototype[Symbol.iterator] = function() {
    return Object.values(this)[Symbol.iterator]()
}
var [a, b] = {a: 1, b: 2}
console.log(a, b);
```

## 迭代器和生成器函数

### 迭代器

```js
function makeRangeIterator(start = 0, end = Infinity, step = 1) {
    let nextIndex = start;
    let iterationCount = 0;

    const rangeIterator = {
        next: function () {
            let result;
            if (nextIndex < end) {
                result = { value: nextIndex, done: false };
                nextIndex += step;
                iterationCount++;
                return result;
            }
            return { value: iterationCount, done: true };
        },
    };
    return rangeIterator;
}

let it = makeRangeIterator(1, 10, 2);

let result = it.next();
while (!result.done) {
    console.log(result.value); // 1 3 5 7 9
    result = it.next();
}

console.log("Iterated over sequence of size: ", result.value); // 5
```

### 生成器函数

```js
function* makeRangeIterator(start = 0, end = Infinity, step = 1) {
    for (let i = start; i < end; i += step) {
        yield i;
    }
}
var a = makeRangeIterator(1, 10, 2);
a.next(); // {value: 1, done: false}
a.next(); // {value: 3, done: false}
a.next(); // {value: 5, done: false}
a.next(); // {value: 7, done: false}
a.next(); // {value: 9, done: false}
a.next(); // {value: undefined, done: true}
```

## 浏览器弹出文件夹选择框

`window.showDirectoryPicker()`：选择文件夹

`window.showOpenFilePicker()`：选择文件

## 文本解码器

**`TextDecoder`** 接口表示一个文本解码器，一个解码器只支持一种特定文本编码，例如 `UTF-8`、`ISO-8859-2`、`KOI8-R`、`GBK`，等等。解码器将字节流作为输入，并提供码位流作为输出。

## 文件阅读器

`FileReader` 对象允许 Web 应用程序异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容，使用 `File` 或 `Blob`对象指定要读取的文件或数据。

## 脚本加载失败

```js
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script>
        const host = ['asddfs.com', 'rgergdf.com']
        const maxRetry = 3
        const retryInfo = {}
        window.addEventListener('error', e => {
            if (e.target.tagName === 'SCRIPT' && !(e instanceof ErrorEvent)) {
                const url = new URL(e.target.src)
                if (retryInfo[url.pathname]?.times > maxRetry) {
                    return
                }
                if (!retryInfo[url.pathname]) {
                    retryInfo[url.pathname] = {
                        times: 0,
                        nextIndex: 0
                    }

                }
                const info = retryInfo[url.pathname]
                url.host = host[info.nextIndex]
                document.write(`<script src="${url.toString()}">\<\/script>`)
                info.times++
                info.nextIndex = (info.nextIndex+1)%host.length
            }
        }, true)
    </script>
</head>
<body>
    <script src="http://static.com/1.js"></script>
    <script src="http://static.com/2.js"></script>
    <script src="http://static.com/3.js"></script>
</body>
</html>
```
