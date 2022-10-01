import Vue from 'vue';
import Vuex from 'vuex';
import {menuList} from '@/api/user'
Vue.use(Vuex);
// 创建state
const state={
    loading:false,
    token:JSON.parse(sessionStorage.getItem('_tk')),
    username:JSON.parse(sessionStorage.getItem('username')),
}
// 创建mutations
const mutations={
    showLoading(state,value){
        state.loading=value;
    },
    setToken(state,value){
        state.token=value;
        sessionStorage.setItem('_tk',JSON.stringify(value))
    },
    removeToken(state,value){
        state.token=value;
        sessionStorage.removeItem('_tk');
    },
    setUsername(state,value){
        state.username=value;
        sessionStorage.setItem('username',JSON.stringify(value))
    },
    removeUsername(state,value){
        state.username=value;
        sessionStorage.removeItem('username');
    },
    setMenuList(state,value){
        state.userId=value;
    }
}
// 创建actions
const actions={
    setLoading(context,value){
        context.commit('showLoadind',value)
    },
    setToken(context,value){
        context.commit('setToken',value)
    },
    setUserId(context,value){
        context.commit('setUserId',value)
    },
    removeUserId(context,value){
        context.commit('removeUserId',value)
    },
    removeToken(context,value){
        context.commit('removeToken',value)
    },
    setUsername(context,value){
        context.commit('setUsername',value)
    },
    removeUsername(context,value){
        context.commit('removeUsername',value)
    },
    setMenuList(context,value){
        
    }
}
// 创建getters
const getters={
    isLoading:(state)=>{
        return state.loading
    },
    getToken:(state)=>{
        return state.token;
    }
}
const store=new Vuex.Store({
    state,
    actions,
    mutations,
    getters,
})
export default store;