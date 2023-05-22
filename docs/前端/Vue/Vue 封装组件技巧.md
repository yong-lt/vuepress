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
// mixin.js
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

## 表格

将表格结构抽离成一个数组，根据数组的配置去动态生成表格。这样做的目的是减少代码体积，方便后期新增字段，改动表格相应配置会很方便

::: tip

除了表格，表单封装思路跟表格一致，根据传递的配置项去显示不同的输入框，下拉框，单选框，开关等。封装完成，就可以将这些模块分离出来，配合具体场景去使用，也可以配合上面的弹框组件进行配合使用
:::

### 组件代码

```vue
<template>
    <el-table ref="table" :data="list" style="width: 100%" row-key="id" border v-loading="loading" @selection-change="handleSelectionChange">
        <el-table-column v-if="selection" :reserve-selection="true" type="selection" min-width="55"></el-table-column>
        <!-- eslint-disable-next-line -->
        <el-table-column
            v-for="item in columnData"
            :label="item.label"
            :prop="item.prop"
            :width="item.width"
            :align="item.align"
            :sortable="item.sortable"
            :fixed="item.fixed"
        >
            <template slot-scope="scope">
                <!-- 额外显示的其他组件 -->
                <template v-if="item.isComponent">
                    <component :is="item.componentName" :prop="item.prop" :item="scope.row"></component>
                </template>
                <!-- 操作栏 -->
                <template v-else-if="item.prop === 'operate'">
                    <slot :row="scope.row"></slot>
                </template>
                <!-- 普通文本 -->
                <template v-else>{{ scope.row[item.prop] }}</template>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
import Vue from "vue";
export default {
    props: {
        column: Array, // 表格列

        list: Array, // 表格数据

        loading: Boolean,

        selection: Boolean,
    },
    data() {
        return {
            columnData: [],
        };
    },
    watch: {
        column: {
            // 在表格中，有些字段会显示组件的情况，需要做一个动态注册组件的操作，根据字段传递的组件路径去显示
            handler(v) {
                this.setComponentsName(v);
            },
            deep: true,
            immediate: true,
        },
    },
    methods: {
        // 设置自定义组件名
        setComponentsName(v) {
            const nodeArr = v.map(item => {
                const copy = { ...item };
                if (item.isComponent) {
                    const componentName = item.componentPath.slice(item.componentPath.lastIndexOf("/") + 1).split(".")[0];
                    copy["componentName"] = componentName;
                }
                return copy;
            });
            this.importComponent(nodeArr);
            this.columnData = nodeArr;
        },
        // 动态注册组件
        importComponent(nodeArr) {
            nodeArr.forEach(item => {
                if (item.isComponent) {
                    Vue.component(item.componentName, resolve => require([`@/views/${item.componentPath}`], resolve));
                }
            });
        },
        // 清除复选框
        clearSelection() {
            this.$refs.table.clearSelection();
        },
        // 清除单条数据复选框
        toggleRowSelection(row, v) {
            this.$refs.table.toggleRowSelection(row, v);
        },
        // 复选框选中数据
        handleSelectionChange(val) {
            this.$emit("handleSelectionChange", val);
        },
    },
};
</script>
```

### 使用组件

先将该组件全局注册

#### 编写表格数组

在配置文件中导出一个像这样的数组

```js
export const column = [
    { id: 1, width: "150", prop: "product_id", label: "货号" },
    { id: 2, width: "120", prop: "audit_status", label: "审核状态", isComponent: true, componentPath: "components/custom_table.vue" },
    { id: 5, width: "100", prop: "product_type_name", label: "商品分类" },
    { id: 7, width: "100", prop: "detail_url", label: "商品图", isComponent: true, componentPath: "components/custom_table.vue" },
    { id: 8, width: "200", prop: "title", label: "商品名称" },
    { id: 13, width: "100", prop: "img_comment", label: "带图评论数", sortable: true },
    { id: 14, width: "100", prop: "goods_comment", label: "好评数", sortable: true },
    { id: 15, width: "100", prop: "between_comment", label: "中评数", sortable: true },
    { id: 16, width: "100", prop: "bad_comment", label: "差评数", sortable: true },
    { id: 17, width: "100", prop: "good_ratio", label: "好评率", sortable: true },
    { id: 18, width: "100", prop: "total_count", label: "总评论数", sortable: true },
    { id: 20, width: "120", prop: "market_price", label: "市场价", sortable: true },
    { id: 21, width: "120", prop: "deal_price", label: "到手价", sortable: true },
    { id: 24, width: "120", prop: "shop_name", label: "店铺名称" },
    { id: 25, width: "120", prop: "service_score", label: "店铺服务" },
    { id: 26, width: "120", prop: "product_score", label: "商品体验" },
    { id: 27, width: "120", prop: "logistics_score", label: "物流体验" },
    { id: 35, width: "340", prop: "operate", label: "操作", fixed: "right" },
];
```

#### 父组件使用

```vue
<template>
	<my-table
        ref="table"
        :column="column"
        :list="tableData"
        :loading="loading"
        selection
        @handleSelectionChange="handleSelectionChange"
    >
        <template v-slot="scope">
            <!-- 修改 -->
            <!-- 作用域插槽 -->
            <el-tooltip
                popper-class="el-tooltip__popper_button"
                class="item"
                effect="dark"
                content="修改"
                placement="top"
            >
                <el-button
                	@click="handleModify(scope.row.product_id_string)"
                    circle icon="el-icon-edit"
                    type="primary"
                    size="mini"
                ></el-button>
            </el-tooltip>
    </my-table>
</template>
<script>
import { column } from "../common/config";

export default {
    data() {
        return {
            tableData: [], // 商品数据
            loading: false,
            column,
            tableTree: column,
        };
    },
    methods: {
        handleSelectionChange(val) {
            this.$bus.$emit("handleSelectionChange", val);
        },
        handleClearTableCurr(row) {
            this.$refs.table.toggleRowSelection(row, false);
        },
        clearSelectionData() {
            this.$refs.table.clearSelection();
        },
    },
};
</script>
```

#### 额外显示的字段组件

该组件会在你传递的组件路径去动态注册，再根据循环传递的配置项去显示对应的内容

```vue
// custom_table.vue
<template>
    <div>
        <template v-if="prop === 'detail_url'">
            <el-image
                style="width: 50px; height: 50px; margin-right: 5px"
                :preview-src-list="item['imageArr']"
                :src="item[prop]"
                fit="fill"
            ></el-image>
        </template>
        <template v-if="prop === 'audit_status'">
            <el-tag v-if="item[prop] === 1" effect="dark" size="mini" type="warning">已保存</el-tag>
            <el-tag v-if="item[prop] === 2" size="mini">初审中</el-tag>
            <el-tag v-if="item[prop] === 3" effect="dark" size="mini" type="success">审核通过</el-tag>
            <el-tag v-if="item[prop] === 4" effect="dark" size="mini" type="danger">审核拒绝</el-tag>
            <el-tag v-if="item[prop] === 5" effect="dark" type="info" size="mini">加入黑名单</el-tag>
            <el-tag v-if="item[prop] === 11" effect="dark" size="mini">终审中</el-tag>
            <el-tag v-if="item[prop] === 12" effect="dark" type="danger" size="mini">驳回</el-tag>
            <tips v-if="item[prop] === 4 || item[prop] === 12" style="font-size: 12px">{{ item["msg"] === "" ? "" : "原因：" + item["msg"] }}</tips>
        </template>

        <template v-if="prop === 'share'">
            <el-tag v-if="item[prop] === 1" effect="dark" size="mini" type="danger">未推荐</el-tag>
            <el-tag v-if="item[prop] === 2" size="mini">已推荐</el-tag>
        </template>

        <template v-if="prop === 'shelves_status'">
            <div v-if="item[prop] === 8">在架</div>
            <div v-if="item[prop] === 9">下架</div>
            <div v-if="item[prop] !== 8 && item[prop] !== 9">--</div>
        </template>
    </div>
</template>

<script>
export default {
    props: {
        prop: String,

        item: Object,
    },
};
</script>

<style></style>
```

## 元素拖拽

::: tip

该组件可以配合着复选框，复选框选中的字段，通过 `list`，传递进来渲染，最后将拖拽好的列表返回给父组件使用。也可以配合表格组件使用，可以让用户自定义显示表格的字段，顺序。原理就是通过`Vue`的响应式，改变表格的`column`，达到表格显示效果
:::

### 组件代码

-   `draggable='true'`：H5 新增属性，允许元素拖拽，提供了相应的 api 使用，[相应的 api 描述参考该链接](https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_Drag_and_Drop_API)
-   Flip：一个动画函数

```vue
<template>
    <div>
        <div style="margin-bottom: 5px">
            <span style="font-weight: bold; font-size: 22px;margin-right: 5px">已选择指标</span>
            <span style="color: #7d8084; font-size: 12px">鼠标悬停可调整顺序</span>
        </div>
        <div ref="checkedRef" class="checked">
            <div draggable="true" class="checked-item" v-for="item in list" :key="item.id" :data-id="item.id">{{ item[name] }}</div>
        </div>
    </div>
</template>

<script>
import File from "../flip";
export default {
    props: {
        allList: Array, // 全部列表

        list: Array, // 复选框选中的列表

        name: String,
    },
    mounted() {
        this.handleSort();
    },
    methods: {
        handleSort() {
            let list = this.$refs.checkedRef;
            let sourceNode; // 当前拖动的元素
            let flip;
            // 利用事件委派
            // 开始拖动
            list.ondragstart = e => {
                // 延时改变样式，否则拖动那一刻的元素也会被改掉
                setTimeout(() => e.target.classList.add("moving"), 0);
                sourceNode = e.target;
                // 开始记录拖动前的位置信息
                flip = new File(list.children, 200);
            };
            //
            list.ondragover = e => {
                e.preventDefault();
            };

            // 当拖动的元素在那个元素之上时会触发该函数
            list.ondragenter = e => {
                // 因为很多元素不允许其他元素在它之前，会默认取消该拖拽行为，所以要取消默认的行为
                e.preventDefault();
                // 排除父元素，与自身
                if (e.target === list || e.target === sourceNode) {
                    return;
                }

                const children = Array.from(list.children);
                const sourceIndex = children.indexOf(sourceNode);
                const targetIndex = children.indexOf(e.target);
                // 判断是上拖拽还是下拖拽
                if (sourceIndex < targetIndex) {
                    list.insertBefore(sourceNode, e.target.nextElementSibling);
                } else {
                    list.insertBefore(sourceNode, e.target);
                }
                // 拖拽完成，播放动画
                flip.play();
            };

            // 拖拽完成
            list.ondragend = e => {
                e.target.classList.remove("moving");
                const children = Array.from(list.children);
                const checkedList = [];
                children.forEach(item => {
                    checkedList.push(this.allList.find(i => i.id == item.dataset.id));
                });
                this.$emit("handleSortSuccess", checkedList);
            };
        },
    },
};
</script>

<style scoped>
.checked {
    height: 450px;
    border: 1px solid #ccc;
    padding: 0 10px 0 10px;
    overflow-x: hidden;
}
.checked .checked-item {
    height: 40px;
    line-height: 40px;
    color: #616369;
    background: rgba(100, 100, 100, 0.2);
    margin: 10px 0;
    padding-left: 10px;
    border-radius: 5px 5px;
    cursor: move;
}
.checked-item.moving {
    background: transparent !important;
    color: transparent !important;
    border: 1px dashed #ccc !important;
}
</style>
```

### Flip

```js
class Flip {
    constructor(list, time) {
        this.list = [...list]; // 监控的元素列表
        this.time = time; // 过渡时间
        this.start = {}; // 元素变化前的位置
        this.end = {}; // 元素变化后的位置
        this.elements = {}; // 变化后的每项元素
        this.saveStart();
    }

    // 保存变化前的位置
    saveStart() {
        for (let i = 0; i < this.list.length; i++) {
            const item = this.list[i];
            const id = `flip-id-${i}`;
            item.dataset.flipId = id;
            this.start[id] = item.getBoundingClientRect();
        }
    }
    // 保存变化后的位置
    saveEnd() {
        for (let i = 0; i < this.list.length; i++) {
            const item = this.list[i];
            const id = item.dataset.flipId;
            item.style.transition = "";
            this.elements[id] = item;
            this.end[id] = item.getBoundingClientRect();
        }
    }

    // 判断元素是否有偏移，计算偏移量
    setTranslate() {
        Object.keys(this.end).forEach(id => {
            const start = this.start[id];
            const end = this.end[id];
            const element = this.elements[id];
            if (start && (start.left !== end.left || start.top !== end.top)) {
                element.style.transform = `translate3d(${start.left - end.left}px, ${start.top - end.top}px, 0px`;
            }
        });
    }

    // 每次拖动需要播放动画
    animate(time = 300) {
        Object.keys(this.end).forEach(id => {
            const element = this.elements[id];
            element.style.transition = `transform ${time}ms linear`;
            element.style.transform = "";
        });
        // 将最后一次变化当作下一次变化的初始位置
        this.start = this.end;
        this.end = {};
    }

    play() {
        this.saveEnd();
        this.setTranslate();
        requestAnimationFrame(() => this.animate(this.time));
    }
}

export default Flip;
```
