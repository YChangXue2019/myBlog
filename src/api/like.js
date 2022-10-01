import { request } from "./request";
// 收藏
export function likeCreate(data){
    return request({
        url:'/like/create',
        method:'POST',
        data:JSON.stringify(data),
    })
};
// 收藏列表查询
export function likeList(data){
    return request({
        url:'/like/list',
        method:'POST',
        data:JSON.stringify(data),
    })
};
// 删除
export function deleteLike(data){
    return request({
        url:'/like/delete',
        method:'POST',
        data:JSON.stringify(data),
    })
};