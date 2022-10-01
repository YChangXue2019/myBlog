import { request } from "./request";
// 头像上传
export function uploadAvatar(data){
    return request({
        url:'/data/avatar',
        method:'POST',
        data:JSON.stringify(data),
    })
};
// 获取用户信息
export function userInfo(data){
    return request({
        url:'/data/user',
        method:'POST',
        data:JSON.stringify(data),
    })
};
// 获取文章信息
export function articleInfo(data){
    return request({
        url:'/data/article',
        method:'POST',
        data:JSON.stringify(data),
    })
};
// 获取文章分类信息
export function categoryInfo(data){
    return request({
        url:'/data/category',
        method:'POST',
        data:JSON.stringify(data),
    })
};
// 获取近七日数据
export function articleSevenInfo(data){
    return request({
        url:'/data/articleSeven',
        method:'POST',
        data:JSON.stringify(data),
    })
};
// 获取今日数据
export function todayInfo(data){
    return request({
        url:'/data/today',
        method:'POST',
        data:JSON.stringify(data),
    })
};
// 获取banner图数据
export function swiperList(data){
    return request({
        url:'/data/swiper',
        method:'POST',
        data:JSON.stringify(data),
    })
};

