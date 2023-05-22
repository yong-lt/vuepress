---
title: React Hooks 原理
date: "2023-05-16"
tags:
    - JavaScript
    - React
categories:
    - React
---

::: tip 本文说明

React 的一些 Hook 实现原理。其原理就是利用闭包。
:::

<!-- more -->

## useState

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';

// 当调用 setState 函数时，需要重新渲染更新 DOM
function render() {
    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
}

// 保存状态的数组
let _state = []
// 每次调用时,需要将状态更下标一一对应
let index = 0

function useMyState(initState) {
    // 在外层创建一个变量，在 setState 需要使用，这时就会产生一个闭包
    let currIndex = index
    // 判断是否有值
    _state[currIndex] = _state[currIndex] === undefined ? initState : _state[currIndex]
	
    // 修改变量的函数
    const setState = function (newState) {
        // 修改为最新的值
        _state[currIndex] = newState
        // 至于为什么将 index 置0 ，因为在 render 时，组件会重新执行，包括 useState ，useState 重新执行
        index = 0
        // 利用 React 更新 DOM
        render()
    }
	// 下标必须 +1
    index += 1

    return [_state[currIndex], setState]
}

function App() {

    const [count, setCount] = useMyState(0)
    const [age, setAge] = useMyState(21)

    return (
        <>
            {count} - {age}

            <button onClick={() => setCount(count + 1)}>+</button>
            <button onClick={() => setAge(age + 1)}>+</button>
        </>
    )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
```

