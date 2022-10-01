import axios from "axios";
import store from "../store";
export function request(config){
    // 创建请求实例
    const instance=axios.create({
        baseURL:'http://localhost:5000/api',
        timeout:5000,
    });
    // 处理请求拦截
    instance.interceptors.request.use((config)=>{
        // if(store.state.token){
        //     config.headers.Authorization=`${store.state.token}`
        // }
        return config;
    },err=>{
        return err;
    })
    // 处理响应拦截
    instance.interceptors.response.use((res)=>{
        return res.data;
    },err=>{
        return err;
    })
    // 发起请求
    return instance(config);
}
