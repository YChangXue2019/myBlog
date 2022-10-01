import Login from '@/views/login'
const LoginRouter=[
    {
        name: 'login',
        path: '/login',
        component:Login,
        meta: {
          title: '登录',
        }, 
    },
]
export default LoginRouter