module.exports = {
    title: 'Q-tao',
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
        // 设置作者姓名
        author: "Q-tao",
        authorAvatar: "/img/avatar.jpg",
        logo: 'https://pic3.zhimg.com/v2-f2e50b61640afcdce9a922289b6989b2_b.webp',
        // 导航栏配置
        subSidebar: 'auto',
        nav: [
            { text: '主页', link: '/', icon: 'reco-home' },
            { 
                text: '前端', link: '/前端/', icon: 'reco-home',
                items: [
                    { 
                        text: '面试相关', 
                        items: [
                            {
                                text: '面试', link: '/前端/面试/js'
                            } 
                        ] 
                    },
                ] 
            }
        ]
    },
    plugins: {
        "@vuepress-reco/vuepress-plugin-bgm-player": {
            position: {
                left: '10px',
                bottom: '100px',
                'z-index': '999999'
            },
            audios: [
                {
                    name: '谢幕',
                    artist: '林俊杰',
                    url: 'https://dl.stream.qqmusic.qq.com/C4000041hXjd15zbnC.m4a?guid=1736931130&vkey=783553B9A4A8137D515F3C478A7E422B65417E183530A8856A5F307A5A0D5EC7E8B66CA8A522963C8BEF7C592FBA643CD7187321F7BCF9ED&uin=1425821290&fromtag=120032',
                    cover: '/img/谢幕.webp'
                },
                {
                    name: '交换余生',
                    artist: '林俊杰',
                    url: "https://dl.stream.qqmusic.qq.com/C400001xYlRT0qUpMt.m4a?guid=9269544688&vkey=403EAE89C36ED11366BE68837BE03FD8A35B90F81A0808A0FB53C2BC07916393685CE3018D2E7E220DB11CC5D74619D69952F92833E548E4&uin=1425821290&fromtag=120032",
                    cover: '/img/交换余生.webp'
                }
            ]
        },
        "vuepress-plugin-cursor-effects": {
            size: 2, // size of the particle, default: 2
            zIndex: 999999999, // z-index property of the canvas, default: 999999999
        }
    }
}