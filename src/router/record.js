import Record from '@/views/record'
import Review from '@/views/record/review'
import Like from '@/views/record/like'
import Collect from '@/views/record/collect'
import ReviewDetail from '@/views/record/reviewDetail'

export default {
    path:'/record',
    name:'record',
    redirect:'/record/review',
    component:Record,
    meta:{
        title:'内容管理',
        requireAuth:true,
    },
    children:[
        {
            path:'/record/review',
            name:'articleReview',
            component:Review,
            meta:{
                title:'评论数据',
                requireAuth:true,
            },
        },{
            path:'/record/collect',
            name:'articleCollect',
            component:Collect,
            meta:{
                title:'收藏数据',
                requireAuth:true,
            },
        },{
            path:'/record/like',
            name:'articleLike',
            component:Like,
            meta:{
                title:'点赞数据',
                requireAuth:true,
            },
        },{
            path:'/record/review/detail',
            name:'reviewDetail',
            component:ReviewDetail,
            meta:{
                title:'评论详情',
                requireAuth:true,
            },
        }
    ]
}