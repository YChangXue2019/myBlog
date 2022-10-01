import { request } from "./request";
// 用户登录
export function userLogin(data){
    return request({
        url:'/user/login',
        method:'POST',
        data:JSON.stringify(data),
    })
};
// 查询该新增用户是否存在
export function usereExist(data){
    return request({
        url:'/user/find',
        method:'POST',
        data:JSON.stringify(data),
    })
};
// 查询用户列表
export function userList(params){
    return request({
        url:'/user/list',
        method:'GET',
        params,
    })
};
// 查询用户详情
export function userDetail(params){
    return request({ 
        url:'/user/detail',
        method:'GET',
        params,
    })
}
// 新增用户
export function createUser(data){
    return request({ 
        url:'/user/new',
        method: 'POST',
        data:JSON.stringify(data),
    })
}
// 修改用户
export function updateUser(data){
    return request({ 
        url:'/user/update',
        method: 'POST',
        data:JSON.stringify(data),
    })
}
// 删除用户
export function deleteUser(data){
    return request({ 
        url:'/user/delete',
        method: 'POST',
        data:JSON.stringify(data),
    })
}
// 修改密码
export function modifiyPwd(data){
    return request({ 
        url:'/user/modifiyPwd',
        method: 'POST',
        data:JSON.stringify(data),
    })
}
// 获取菜单
export function menuList(params){
    return request({ 
        url:'/user/auth',
        method: 'GET',
        params,
    })
}
