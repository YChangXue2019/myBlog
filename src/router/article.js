import Send from '@/views/article/send'
import List from '@/views/article/list'
import Category from '@/views/article/category'
import Detail from '@/views/article/detail'
const RouteView = {
    name: 'RouteView',
    render: (h) => h('router-view')
};
export default {
    path:'/article',
    name:'article',
    redirect:'/article/list',
    component:RouteView,
    meta:{
        title:'内容管理',
        requireAuth:true,
    },
    children:[
        {
            path:'/article/send',
            name:'articleSend',
            component:Send,
            meta:{
                title:'发表文章',
                requireAuth:true,
            },
        },{
            path:'/article/category',
            name:'articleCategory',
            component:Category,
            meta:{
                title:'文章分类',
                requireAuth:true,
            },
        },{
            path:'/article/list',
            name:'articleList',
            component:List,
            meta:{
                title:'文章列表',
                requireAuth:true,
            },
        },{
            path:'/article/detail',
            name:'articleDetail',
            component:Detail,
            meta:{
                title:'文章详情',
                requireAuth:true,
            },
        },
    ]
}
