import Vue from 'vue'
import Router from 'vue-router'
import LoginRouter from './login'
import LayoutRouter from './layout'
import store from '@/store'
const originalPush = Router.prototype.push

Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(Router)
const routes=[
  { 
    path:'/',
    redirect:'/login',
  },
  ...LoginRouter,
  ...LayoutRouter,
];
const router=new Router({
  routes,
})
router.beforeEach((to,from,next)=>{
  if(to.meta.requireAuth){
    if(store.state.token){
      next();
    }else{
      next({
        path:'/login',
      })
    }
  }else{
    next();
  }
})
export default router
