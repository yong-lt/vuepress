---
title: Vue 封装组件技巧
date: "2023-05-16"
tags:
    - JavaScript
    - Vue
categories:
    - Vue
---

::: tip 本文说明

分享一些组件封装思想
:::

<!-- more -->

## 前言

本文以 [Vue2](https://v2.cn.vuejs.org/) 与 [Element](https://element.eleme.io/#/zh-CN) 进行演示，封装一些很常见，常用的组件。

## 弹框

封装该组件，能使模块进行拆分，显示组件只负责传递数据，显示数据，将更多的操作集中在父组件，以便在后续开发中，快速定位问题以及业务功能的扩展。

### 组件代码

-   具体弹框配置，可以单独提出来，也可以写死，具体情况根据业务需求即可

```vue
<template>
    <el-dialog
        :title="title"
        :visible="show"
        :width="width"
        @close="onClose"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :append-to-body="true"
    >
        <component ref="componentRef" :is="componentName" :dataProps="dataProps" :payload="payload" @handleEvent="handleEvent" />
        <span slot="footer" class="dialog-footer">
            <slot>
                <!-- 默认显示取消，确定按钮，也可以自定义按钮 -->
                <el-button @click="onClose">取 消</el-button>
                <el-button type="primary" @click="onClose">确 定</el-button>
            </slot>
        </span>
    </el-dialog>
</template>

<script>
import Vue from "vue";

export default {
    name: "MyDialog",
    props: {
        title: String, // 弹框 title

        width: String, // 弹框宽度

        show: Boolean, // 弹框显示隐藏

        path: String, // 弹框内部显示内容组件在项目中的路径，路径需要带上 ***.vue

        dataProps: [Object, Array], // 组件需要的初始数据，将在传递给组件时，通过watch重新赋值给组件私有data

        payload: Object, // 传递给组件的额外携带参数
    },
    data() {
        return {
            componentName: "",
        };
    },
    watch: {
        show: {
            handler(val) {
                // 弹框显示时，根据传递的组件在项目中的路径，动态注册组件
                if (val) {
                    this.componentName = this.path.slice(this.path.lastIndexOf("/") + 1).split(".")[0];
                    Vue.component(this.componentName, resolve => require([`@/views/${this.path}`], resolve));
                }
            },
        },
    },
    methods: {
        /**
         * 显示组件传递的自定义事件
         * payload 需要以 {
         *      name: "事件名",
         *      data: {} 传递给父组件的数据，自己定义传递属性
         * }
         */
        handleEvent(payload) {
            this.$emit("handleEvent", payload);
        },
        /**
         * 以下方法，弹窗关闭，点击确认按钮时，需要调用的方法
         * 需要在显示组件内部提供 set, get两个方法
         * set 一般清除组件的状态数据
         * get 一般需要把组件的最新数据 return 给父组件使用
         */
        onClose() {
            this.$refs.componentRef.set();
            this.$emit("handleEvent", { name: "close" });
        },
        onConfirm() {
            this.$emit("handleEvent", { name: "confirm", data: this.$refs.componentRef.get() });
        },
    },
};
</script>
```

### 使用组件

#### 将该组件全局注册，以便在任何地方使用

```js
import MyDialog from "@/views/controls/MyDialog/index.vue";
Vue.component(MyDialog.name, MyDialog);
```

#### 编写需要显示的组件

```vue
<template>
    <div>
        <el-table :data="originData">
            <el-table-column prop="product_id_string" label="货号"></el-table-column>
            <el-table-column prop="title" label="商品名称"></el-table-column>
            <el-table-column prop="detail_url" label="商品图片">
                <template slot-scope="scope">
                    <img style="width: 50px; height: 50px;" :src="scope.row.detail_url" />
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="warning" size="mini" @click="onDelete(scope.row)">移除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <tips>共{{ originData.length }}条</tips>
    </div>
</template>

<script>
import mixin from "@/utils/mixin";

export default {
    props: {
        dataProps: Array,

        payload: Object,
    },
    mixins: [mixin],
    data() {
        return {
            originData: [],
        };
    },
    methods: {
        onDelete(row) {
            this.$bus.$emit("handleClearTableCurr", row);
        },
    },
};
</script>
```

::: tip

如果每次都要去写`watch`, `get`，`set`，对`props`进行监听重新赋值组件私有数据，可以写一个公共的`mixin`，使用组件时，导入该文件即可。

你也可以在组件内部定义`get`，`set`，以便在弹窗显示或关闭时做出相应操作。
:::

```js
export default {
    watch: {
        dataProps: {
            handler(val) {
                this.originData = val;
            },
            deep: true,
            immediate: true,
        },
    },
    methods: {
        get() {
            return this.originData;
        },
        set() {
            const tag = Object.prototype.toString.call(this.originData);
            const thisArg = [
                "[object String]",
                "[object Number]",
                "[object Boolean]",
                "[object Null]",
                "[object Undefined]",
                "[object Array]",
                "[object Object]",
            ];
            const type = ["", 0, false, null, undefined, [], {}];
            this.originData = type[thisArg.indexOf(tag)];
        },
    },
};
```

#### 父组件使用

`path`参数为显示组件在项目中的路径，注册时是以`@/views/`出发找组件的，具体场景可修改注册路径即可

```vue
<template>
    <my-dialog
        :title="'更新列表'"
        :width="'1000px'"
        :show="showGoodsUpdataList"
        :path="'goods_audit/components/goods_updata_list.vue'"
        :dataProps="tableSelectionData"
        @handleEvent="goodsUpdataListEvent"
    />
</template>

<script>
export default {
    methods: {
        goodsUpdataListEvent(payload) {
            // console.log(payload.name)
            // console.log(payload.data)
            switch (payload.name) {
                case "confirm":
                    break;
                case "close":
                    break;
                default:
                    break;
            }
        },
    },
};
</script>
```
