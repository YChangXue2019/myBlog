import DataView from '@/views/dataview'
const dataViewRouter=[
    {
        path:'/index',
        name:'index',
        component:DataView,
        meta:{
            title:'数据统计',
            requireAuth:true,
        }
    }
]
export default dataViewRouter