import { request } from "./request";
//banner图上传
export function uploadBanner(data){
    return request({
        url:'/banner/upload',
        method:'POST',
        data:JSON.stringify(data),
    })
};
//banner列表查询
export function bannerList(data){
    return request({
        url:'/banner/list',
        method:'POST',
        data:JSON.stringify(data),
    })
};
//修改banner图
export function updateBanner(data){
    return request({
        url:'/banner/update',
        method:'POST',
        data:JSON.stringify(data),
    })
};
//删除banner图
export function deleteBanner(data){
    return request({
        url:'/banner/delete',
        method:'POST',
        data:JSON.stringify(data),
    })
};
