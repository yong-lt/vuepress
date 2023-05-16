const nav = require("./config/nav")
const plugins = require("./config/plugins")

module.exports = {
    title: 'yong-lt',
    head: [
        ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }],
        ["link", { rel: "stylesheet", href: "/css/style.css" }]
    ],
    // 主题插件
    theme: "reco",
    locales: {
        '/': {
            lang: 'zh-CN'
        }
    },
    themeConfig: {
        type: 'blog',
        author: "yong-lt",
        authorAvatar: "/img/avatar.jpg",
        logo: 'https://pic3.zhimg.com/v2-f2e50b61640afcdce9a922289b6989b2_b.webp',
        subSidebar: 'auto',
        nav: nav
    },
    plugins: plugins
}