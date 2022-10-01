import { request } from "./request";
// 查询博客列表
export function blogList(params){
    return request({
        url:'/blog/list',
        method:'GET',
        params,
    })
};
// 查询博客详情
export function blogDetail(params){
    return request({ 
        url:'/blog/detail',
        method:'GET',
        params,
    })
}
// 新建博客
export function createBlog(data){
    return request({ 
        url:'/blog/new',
        method: 'POST',
        data:JSON.stringify(data),
    })
}
// 修改博客
export function updateBlog(data){
    return request({ 
        url:'/blog/update',
        method: 'POST',
        data:JSON.stringify(data),
    })
}
// 删除博客
export function deleteBlog(data){
    return request({ 
        url:'/blog/delete',
        method: 'POST',
        data:JSON.stringify(data),
    })
}
// 查询博客对应的评论
export function blogReview(data){
    return request({ 
        url:'/blog/review',
        method: 'POST',
        data:JSON.stringify(data),
    })
}
// 查询博客对应收藏、评论、点赞数量
export function blogDetailTotal(data){
    return request({ 
        url:'/blog/detailTotal',
        method: 'POST',
        data:JSON.stringify(data),
    })
}
export function blogCollectExist(data){
    return request({ 
        url:'/blog/collectExist',
        method: 'POST',
        data:JSON.stringify(data),
    })
}
export function blogLikeExist(data){
    return request({ 
        url:'/blog/likeExist',
        method: 'POST',
        data:JSON.stringify(data),
    })
}
// 博客图片上传
export function uploadImg(data){
    return request({ 
        url:'/blog/upload',
        method: 'POST',
        data:JSON.stringify(data),
    })
}