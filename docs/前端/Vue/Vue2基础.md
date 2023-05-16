---
title: Vue2 基础知识
date: "2023-05-16"
tags:
    - JavaScript
    - Vue
categories:
    - Vue
---

::: tip 本文说明

Vue2 的一些基础知识，适合新手阅读本文快速上手
:::

<!-- more -->

## Vue

[Vue 官网](https://cn.vuejs.org/)

## 声明式渲染

Vue.js 的核心是一个允许采用简洁的模板语法来声明式地将数据渲染进 DOM 的系统

```html
<div id="app">{{ message }}</div>

<script>
    const vm = new Vue({
        el: "#app", // element，代表了 view
        data: {
            // 代表了 Model
            message: "Hello",
        },
    });
</script>
```

-   el 表示关联的视图
-   data 表示要渲染的数据
-   创建的 Vue() 实例相当于是 MVVM 架构中的 VM （ViewModel）
-   所有东西都是**响应式的**（数据被修改后，视图会自动重新渲染）

## Vue 实例

### 数据与方法

#### **数据：**

-   当一个 Vue 实例被创建时，它将 `data` 对象中的所有的 property 加入到 Vue 的**响应式系统**中，即会将 data 中定义的各属性直接挂载到 Vue 实例下，可以使用 Vue 实例直接调用到 data 中定义的各属性（如果 data 对象中有以 `$` 或 `_` 开头的属性，不会直接挂载到 Vue 实例下），当 data 中数据被更新时，会自动更新页面渲染。
-   **只有当实例被创建时就已经存在于 `data` 中的 property 才是响应式的。**
-   在 vue 实例下有 `$data` 属性，代表的就是 data 对象。
-   在 vue 实例下有 `$options` 属性，代表的是创建 Vue 实例时的选项对象。

#### **方法：**

-   创建 Vue 实例时，在 `methods` 选项中定义的方法也会被直接挂载到 Vue 实例下。

```js
method: {
    方法名1() {},
    方法名2() {},
    方法名3() {},
}
```

## 模板语法

### 插值

#### 文本

```html
{{ expression }}
```

双花括号之间书写的是 JS 表达式，主要用于绑定渲染文本数据。

双大括号会将数据解释为普通文本，而非 HTML 代码。（对于 HTML 文本，{{  }} 语法会进行转义处理，目的是为了避免出现 XSS 攻击）

#### html

v-html 指令

#### attributes

v-bind 指令

### 指令

就是在 HTML 标签中新添加的一些（以 `v-*` 开头的）有特殊意义的属性，利用这些属性，在 Vue 中可以实现相应的功能处理。

-   v-html: 渲染 HTML 文本

-   v-text: 渲染纯文本

-   v-bind: 动态绑定属性值，在标签中绑定属性值是不能使用 `{{}}` 语法，而是需要使用 `v-bind` 指令。可简写为 `:`

-   v-on: 注册事件监听，可简写为 `@`

-   与条件渲染相关：

    -   v-if: 操作的是 DOM 树中节点的销毁、重建
    -   v-else-if:
    -   v-else:
    -   v-show: 操作的是 CSS 样式中的 display

-   **v-if vs v-show**：`v-if` 有更高的切换开销，而 `v-show` 有更高的初始渲染开销。因此，如果需要非常频繁地切换，则使用 `v-show` 较好；如果在运行时条件很少改变，则使用 `v-if` 较好。

-   与列表渲染相关：

    -   v-for:

    ```html
    <li v-for="item in array"></li>
    <li v-for="item of array"></li>
    <li v-for="(item, index) in array"></li>
    <li v-for="(item, index) of array"></li>

    <li v-for="value in object"></li>
    <li v-for="value of object"></li>
    <li v-for="(value, key) in object"></li>
    <li v-for="(value, key) of object"></li>
    <li v-for="(value, key, index) in object"></li>
    <li v-for="(value, key, index) of object"></li>

    <li v-for="n in number"></li>
    <li v-for="n of number"></li>
    ```

    -   v-for 与 v-if 一起使用：**不推荐**同时使用 `v-if` 和 `v-for`。2.x 中当 `v-if` 与 `v-for` 一起使用时，`v-for` 具有比 `v-if` 更高的优先级；而 3.x 的版本中则反过来。
    -   建议尽可能在使用 `v-for` 时提供 `key` attribute，除非遍历输出的 DOM 内容非常简单，或者是刻意依赖默认行为以获取性能上的提升。

-   v-once: 只渲染元素和组件**一次**

-   v-pre: 原样显示

-   v-cloak: 这个指令保持在元素上直到关联实例结束编译。通常结合 css 规则：`[v-cloak] { display: none }` 一起使用，避免看到未经编译的视图模板内容。

-   v-model: `v-model` 指令在表单 `<input>`、`<textarea>` 及 `<select>` 元素上创建双向数据绑定。

-   v-slot: 具名插槽使用，可简写为 `#`

## 计算属性与侦听器

### 计算属性

```js
computed: {
    计算属性名1() {},
    计算属性名2() {},
    计算属性名3() {},
}
```

特点：

-   对复杂的逻辑表达式进行简化运算，方便阅读
-   **计算属性值能够被缓存**，只要依赖项不发生变化，就会一直使用缓存的值。只在相关响应式依赖发生改变时它们才会重新求值。

#### vs method

-   计算属性可被缓存，方法不能被缓存

#### 为什么需要缓存？

假设我们有一个性能开销比较大的计算属性 **A**，它需要遍历一个巨大的数组并做大量的计算。然后我们可能有其他的计算属性依赖于 **A**。如果没有缓存，我们将不可避免的多次执行 **A** 的 getter！如果你不希望有缓存，请用方法来替代。

### 侦听器（侦听属性）

当需要在数据变化时执行异步或开销较大的操作时，使用侦听器这个方式是最有用的。

```js
data: {
    firstName: 'Foo',
    lastName: 'Bar',
    fullName: 'Foo Bar'
  },
  watch: {
    firstName: (val) => {
      this.fullName = val + ' ' + this.lastName
    },
    lastName: (val) => {
      this.fullName = this.firstName + ' ' + val
    }
  }
```

#### vs 计算属性

-   计算属性可被缓存，侦听属性不能被缓存
-   侦听属性中可包含异步操作等副作用动作，而计算属性中不能包含
-   计算属性通常是由一个或多个响应式数据计算出一个值返回；而侦听属性通常是监听一个数据的变化，由这一个数据的变化可能影响到另外的一个或多个数据的变化

## class 与 style 绑定

vue 对节点绑定 class 与 style 进行了功能增加，除了可以绑定字符串外，也可以绑定对象或数组。

### 条件渲染

v-if、v-show 指令

### 列表渲染

v-for 指令

绑定 key

### 数组更新检测

#### 变更方法（变异方法）

调用这些方法后，原数组本身会受影响：

-   push()
-   pop()
-   unshift()
-   shift()
-   splice()
-   sort()
-   reverse()

调用变更方法后修改数组后，页面会响应式渲染

#### 替换数组

如 slice() 、concat() 这类方法，调用后原数组本身不受影响，页面没有响应式渲染，如果需要将调用结果响应式渲染，可使用替换数组的方式，即利用 `=` 赋值运算符重新将数组数据值修改。

## 事件处理

v-on 指令

### 内联处理器中的方法

可以传递 $event 代表事件对象

### 事件修饰符：

-   .stop
-   .prevent

### 按键修饰符：

-   tab
-   enter
-   ......

## 表单处理

v-model 指令

v-model 是语法糖。

`v-model` 在内部为不同的输入元素使用不同的 property 并抛出不同的事件：

-   text 和 textarea 元素使用 `value` property 和 `input` 事件；
-   checkbox 和 radio 使用 `checked` property 和 `change` 事件；
-   select 字段将 `value` 作为 prop 并将 `change` 作为事件。

## 组件系统

组件系统是 Vue 的另一个重要概念，因为它是一种抽象，允许我们使用小型、独立和通常可复用的组件构建大型应用。

在 Vue 里，一个组件本质上是一个拥有预定义选项的一个 Vue 实例。

### 定义组件

#### 选项

```js
const options = {
    // template 是关联视图的html模板
    template: `
		<h1>自定义的组件</h1>
	`,
};
```

#### 注册组件

##### **全局：**

```js
Vue.component(name, options);
```

##### **局部：**

```js
// 定义组件的选项对象
const options = {
    // template 是关联视图的html模板
    template: `
    <h1>自定义的组件</h1>
  `,
    components: {
        "sub-header": subOptions,
    },
};
```

在父组件的选项对象中添加 `components` 字段，注册父组件中可以使用到的子组件（即局部注册）

#### 使用组件

将组件名作为自定义标签名来使用，使用标签名时，采用短横线命名规范（即多个单词之间使用 `-` 分隔）

### 单文件组件

后缀名为 `*.vue` 的文件，在 webpack 中处理该类型的文件，会使用 `vue-loader` 的 `loader` 来处理。

```vue
<template>
    <!-- View 布局结构 -->
</template>

<script>
// JS 交互逻辑
</script>

<style lang="scss">
/* 样式 */
</style>
```

在 vs-code 中可安装 `Vetur` 插件，在 `*.vue` 文件中才会有代码高亮及部分代码提示功能。

### data 为什么必须是一个函数

组件是可被复用的，同一个组件创建出的不同实例彼此之间应该是相互独立的。对象是引用数据类型，如果组件选项中的 data 属性是一个普通对象，则同一个组件所创建出来的所有实例会共享（共用）同一个 data 对象的数据，则任意一个实例对 data 中数据修改时，其它实例都会受影响。

**将 data 定义为一个函数，在该函数体内部返回一个普通对象**，这样，当创建组件实例时，会调用 data() 方法，获取返回的新数据对象，则各组件实例间就有自己独立的数据对象了（互不受影响），这与实际开发更符合。

### 组件通信

组件与组件之间传递数据

#### 父子组件通信：

-   父传子：利用 `props` 属性传递

```js
data() {
    return {
        dataList: [
        {
          id: 1,
          title: '学习 HTML',
          status: true
        },
        {
          id: 2,
          title: '学习 CSS',
          status: true
        },
        {
          id: 3,
          title: '学习 JavaScript',
          status: false
        }
      ]
    }
}

// 父组件
<div class="father" :data="dataList">

// 子组件
props: {
    data: {
        type: Array,
        default() {
            return []
        }
    },
}
```

-   子传父：利用事件。在父组件中使用子组件时，绑定一个自定义事件；在子组件中需要传递数据时，触发($emit())在父组件中绑定的事件即可。

```html
// 父组件 // add 自定义触发事件名 // addList 事件处理程序
<div class="father" @add="addList">
    // 子组件
    <div class="son" @click="handleAdd">
        <script>
            export default {
                methods: {
                    handleAdd() {
                        // 触发 $emit('触发父组件中自定义事件名', 传递的数据)
                        this.$emit("add", this.inputValue);
                    },
                },
            };
        </script>
    </div>
</div>
```

#### 跨组件跨层级通信：

-   转换为父子组件通信

-   event-bus（事件总线）：借助事件，将数据从一个组件中传递到另一个组件中。

    -   利用 Vue 对象实例的 `$on()` 与 `$emit()` 方法
    -   `$on()` 用于注册事件监听
    -   `$emit()` 用于触发指定的事件
    -   通信（传递数据）：在 Vue 原型上添加 $bus 属性；在需要接收数据的组件中，调用 `$on()`注册事件监听，在需要传递数据的组件中，调用`$emit()` 触发事件并传递数据

    ```js
    // 在 main.js 中添加
    Vue.prototype.$bus = new Vue()

    // 父组件中
    created() {
        this.$bus.$on('remove', this.removeTodoitem)
        this.$bus.$on('change', this.changeTodoitem)
    }
    methods: {
        removeTodoitem(data) {},
        changeTodoitem(data) {},
    }

    // 子组件中
     methods: {
        handleRemove() {
          this.$bus.$emit('remove', this.todoItem.id)
        },
        handleChange() {
          this.$bus.$emit('change', this.todoItem.id)
        }
      }
    ```

-   vuex

-   ref

    -   不建议使用，会导致数据流的紊乱

### Props 属性

props 是组件从父组件接收到的数据:

```js
{
    props: ["propName1", "propName2"];
}
```

-   可以简单定义一个数组，声明组件所能接收并处理的属性名称。
-   组件 props 属性中接收到的数据也会被直接挂载到组件实例下。

```js
{
  props: {
    // 基础的类型检查 (`null` 和 `undefined` 会通过任何类型验证)
    propA: Number,
    // 多个可能的类型
    propB: [String, Number],
    // 必填的字符串
    propC: {
      type: String,
      required: true
    },
    // 带有默认值的数字
    propD: {
      type: Number,
      default: 100
    },
    // 带有默认值的对象
    propE: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
      default: function () {
        return { message: 'hello' }
      }
    },
    // 自定义验证函数
    propF: {
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return ['success', 'warning', 'danger'].indexOf(value) !== -1
      }
    }
  }
}
```

-   也可以将 props 定义为一个对象，可实现对属性的验证

注意：

-   props 应该是只读的，即不要修改组件获得到的属性值
-   如果业务中涉及到可能修改属性的值，则需要尝试转换为 data 或 computed 计算属性的方式重新设计。

### 插槽

作用：在使用组件时，向组件内部分发内容。

使用：`<slot>`

`<slot>` 相当于是一个占位符

#### 命名插槽（具名插槽）

`<slot name="slot-name">`

在使用具名插槽分发内容时，可以使用 `slot` 属性或 `v-slot` 指令

-   slot 属性是 v2.6 之前版本中使用的
-   v-slot 指令是 v2.6 中新增的语法，现在推荐使用 `v-slot` 指令
    -   v-slot 指令需要用在 `<template>` 标签内部，即：`<template v-slot:slotName>`
    -   `v-slot` 可以简写为 `#`

```html
// 子组件
<slot name="subtitle">
    <p class="subtitle">ToDoList...</p>
</slot>

// 父组件
<template v-slot:subtitle>
    <a href="/">Vue-todo</a>
</template>
```

## 生命周期

生命周期：指的是一个 Vue 实例或组件从开始创建，到最终销毁，全阶段所经历的所有过程。

### 生命周期钩子（函数）

就是在组件正常的生命周期过程中，提供了一些回调函数，在这些回调函数中可以添加用户自己的代码，完成特定的自定义功能。

#### create 阶段

-   beforeCreate() - 不能使用`props`，`data`，`method`
-   created() - 可以使用实例直接调用到`props`，`data`，`method`，但是组件的模板结构尚未生成

#### mount 阶段

-   beforeMount() - 将要把内存中编译好的 HTML 渲染到浏览器中，此时浏览器还没有当前组件的 DOM 结构
-   mounted() - 已经把内存中的 HTML 结构，渲染到浏览器中，浏览器已经包含当前组件的 DOM 结构

#### update 阶段

当数据发生变化时，会进行 update 更新阶段

-   beforeUpdate() - 已经是最新数据，还未重新渲染模板结构
-   updated() - 根据最新的数据重新渲染

#### destroy 阶段

通常在销毁阶段会销毁哪些资源：启动的定时器、主动注册的事件监听、未完成的网络请求、打开的 socket 连接等

-   beforeDestroy() - 将要销毁组件，但组件还未销毁，处于正常的工作状态
-   destroyed() - 组件已销毁，结构已被移除

#### keep-alive 组件

-   activated(): 被 keep-alive 缓存的组件激活时调用
-   deactivated()：被 keep-alive 缓存的组件失活时调用。

## nextTick()

在下次 DOM 更新循环结束之后执行延迟回调。

在修改数据之后立即使用这个方法，获取更新后的 DOM。

```js
this.$nextTick(() => {});
```

## 渲染函数（render）

```js
render(createElement) {
    // render
}
```

-   createElement() 创建的虚拟节点元素
-   createElement() 有三个参数：标签、属性、孩子节点

### 虚拟 DOM

```html
<div class="container">
    <span title="提示" class="_span">span_1</span>
    <a href="/">链接</a>
</div>
```

会被编译为 render() 渲染函数中的内容：

```js
render(createElement) {
    return createElement(
        'div',
        { className: 'container' },
        [
            createElement(
                'span',
                { title: '提示', className: '_span' },
                ['span_1']
            ),
            createElement(
                'a',
                { href: '/' },
                ['链接']
            ),
        ]
    )
}
```

调用后，返回一个对象：

```js
{
    tag: 'div',
    props: { className: 'container' },
    children: [
        {
            tag: 'span',
           	props: { title: '提示', className: '_span' },
            children: ['span_1']
        },
        {
            tag: 'a',
           	props: { href: '/' },
            children: ['链接']
        },
    ]
}
```

这是一个保存在内存中的虚拟 DOM 元素结构，这个结构与实体 DOM 树结构映射。

## 响应式原理

### 数据劫持

v2.x 版本中，使用 `Object.defineProperty()` 实现数据劫持

v3.x 版本中，使用 `Proxy` 实现数据劫持

## 过滤器

作用：可被用于一些常见的文本格式化。

过滤器可以用在两个地方：**双花括号插值和 `v-bind` 表达式**

过滤器应该被添加在 JavaScript 表达式的尾部，由“管道”（`|`）符号指示。

### 全局

```js
Vue.filter();
```

### 局部

```js
// 在选项对象中，添加 filters 字段
options = {
    filters: {},
};
```

## keep-alive

`<keep-alive>` 包裹动态组件时，会**缓存**不活动的组件实例，而不是销毁它们。

当组件在 `<keep-alive>` 内被切换，它的 `activated` 和 `deactivated` 这两个生命周期钩子函数将会被对应执行。

## 自定义指令

-   全局

```js
// 注册一个全局自定义指令 `v-focus`
Vue.directive("focus", {
    // 当被绑定的元素插入到 DOM 中时……
    inserted: function (el) {
        // 聚焦元素
        el.focus();
    },
});
```

-   局部

```js
directives: {
  focus: {
    // 指令的定义
    inserted: function (el) {
      el.focus()
    }
  }
}
```

### 钩子函数

-   `bind`：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
-   `inserted`：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
-   `update`：所在组件的 VNode 更新时调用，**但是可能发生在其子 VNode 更新之前**。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新 (详细的钩子函数参数见下)。
-   `componentUpdated`：指令所在组件的 VNode **及其子 VNode** 全部更新后调用。
-   `unbind`：只调用一次，指令与元素解绑时调用。

#### 钩子函数参数

-   `el`：指令所绑定的元素，可以用来直接操作 DOM。
-   `binding`：一个对象，包含以下 property：
    -   `name`：指令名，不包括 `v-` 前缀。
    -   `value`：指令的绑定值，例如：`v-my-directive="1 + 1"` 中，绑定值为 `2`。
    -   `oldValue`：指令绑定的前一个值，仅在 `update` 和 `componentUpdated` 钩子中可用。无论值是否改变都可用。
    -   `expression`：字符串形式的指令表达式。例如 `v-my-directive="1 + 1"` 中，表达式为 `"1 + 1"`。
    -   `arg`：传给指令的参数，可选。例如 `v-my-directive:foo` 中，参数为 `"foo"`。
    -   `modifiers`：一个包含修饰符的对象。例如：`v-my-directive.foo.bar` 中，修饰符对象为 `{ foo: true, bar: true }`。
-   `vnode`：Vue 编译生成的虚拟节点。移步 [VNode API](https://cn.vuejs.org/v2/api/#VNode-接口) 来了解更多详情。
-   `oldVnode`：上一个虚拟节点，仅在 `update` 和 `componentUpdated` 钩子中可用。

###
