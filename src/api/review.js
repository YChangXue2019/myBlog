import { request } from "./request";
export function reviewList(data){
    return request({
        url:'/review/list',
        method:'POST',
        data:JSON.stringify(data),
    })
};
export function createReview(data){
    return request({
        url:'/review/new',
        method:'POST',
        data:JSON.stringify(data),
    })
};
export function updateReview(data){
    return request({
        url:'/review/update',
        method:'POST',
        data:JSON.stringify(data),
    })
};
export function deleteReview(data){
    return request({
        url:'/review/delete',
        method:'POST',
        data:JSON.stringify(data),
    })
};
export function reviewTotal(data){
    return request({
        url:'/review/total',
        method:'POST',
        data:JSON.stringify(data),
    })
};
export function detailReview(data){
    return request({
        url:'/review/detail',
        method:'POST',
        data:JSON.stringify(data),
    })
};