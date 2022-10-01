import Layout from '@/layout'
import dataViewRouter from './dataview'
import articleRouter from './article'
import userRouter from './user'
import pictureRouter from './picture'
import recordRouter from './record'
const LayoutRouter=[
    {
        path:'/layout',
        name:'layout',
        redirect:'/index',
        component:Layout,
        meta:{
            title:'登录后首页',
            requireAuth:true,
        },
        children:[
            ...dataViewRouter,
            articleRouter,
            recordRouter,
            pictureRouter,
            ...userRouter,
        ]
    }
]
export default LayoutRouter