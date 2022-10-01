import { request } from "./request";
export function categoryList(params){
    return request({
        url:'/category/list',
        method:'GET',
        params,
    })
};
export function createCategory(data){
    return request({
        url:'/category/new',
        method:'POST',
        data:JSON.stringify(data),
    })
};
export function updateCategory(data){
    return request({
        url:'/category/update',
        method:'POST',
        data:JSON.stringify(data),
    })
};
export function deleteCategory(data){
    return request({
        url:'/category/delete',
        method:'POST',
        data:JSON.stringify(data),
    })
};
export function detailCategory(params){
    return request({
        url:'/category/detail',
        method:'GET',
        params,
    })
};
export function createCheck(data){
    return request({
        url:'/category/find',
        method:'POST',
        data:JSON.stringify(data),
    })
};
export function updateArticleNum(data){
    return request({
        url:'/category/articleNum',
        method:'POST',
        data:JSON.stringify(data),
    })
};
export function updateReviewNum(data){
    return request({
        url:'/category/reviewNum',
        method:'POST',
        data:JSON.stringify(data),
    })
};
export function categoryOption(params){
    return request({
        url:'/category/option',
        method:'GET',
        params,
    })
};
