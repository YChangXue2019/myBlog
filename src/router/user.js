import User from '@/views/user'
import List from '@/views/user/list'
const userRouter=[
    {
        path:'/user',
        name:'user',
        redirect:'/user/list',
        component:User,
        meta:{
            title:'用户管理',
            requireAuth:true,
        },
        children:[
            {
                path:'/user/list',
                name:'userList',
                component:List,
                meta:{
                    title:'用户列表',
                    requireAuth:true,
                },
            }
        ]
    }
]
export default userRouter