import Picture from '@/views/picture'
import Banner from '@/views/picture/banner'
export default {
    path:'/picture',
    name:'picture',
    redirect:'/picture/banner',
    component:Picture,
    meta:{
        title:'图片管理',
        requireAuth:true,
    },
    children:[
        {
            path:'/picture/banner',
            name:'banner',
            component:Banner,
            meta:{
                title:'banner图管理',
                requireAuth:true,
            },
        }
    ]
}
