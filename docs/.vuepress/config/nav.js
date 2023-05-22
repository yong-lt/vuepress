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
                text: "JavaScript技巧", 
                link: "/前端/JavaScript/js技巧" 
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
            },
            { 
                text: "React", 
                link: "/前端/React/", 
                items: [
                    { 
                        text: "Hook原理", 
                        link: "/前端/React/Hook原理" 
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
