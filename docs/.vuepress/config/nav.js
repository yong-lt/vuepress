module.exports = [
    { 
        text: "主页", 
        link: "/", 
        icon: "reco-home" 
    },
    {   
        text: "前端", 
        link: "/前端/", 
        icon: "reco-blog",
        items: [
            { 
                text: "面试相关", 
                link: "/前端/面试/js" 
            },
            { 
                text: "Vue", 
                link: "/前端/Vue/", 
                items: [
                    { 
                        text: "组件封装", 
                        link: "/前端/Vue/Vue 封装组件技巧" 
                    },
                ] 
            }
        ],
    },
    { 
        text: 'GitHub', 
        link: 'https://github.com/yong-lt', 
        icon: "reco-github"
    },
];
