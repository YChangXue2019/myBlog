import { request } from "./request";
// 收藏
export function collectCreate(data){
    return request({
        url:'/collect/create',
        method:'POST',
        data:JSON.stringify(data),
    })
};
// 收藏列表查询
export function collectList(data){
    return request({
        url:'/collect/list',
        method:'POST',
        data:JSON.stringify(data),
    })
};
// 删除
export function deleteCollect(data){
    return request({
        url:'/collect/delete',
        method:'POST',
        data:JSON.stringify(data),
    })
};