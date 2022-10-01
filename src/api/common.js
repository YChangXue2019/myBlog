import { request } from "./request";
// 获取侧栏菜单
export function menuList(data){
    return request({
        url:'/common/smenu',
        method:'POST',
        data:JSON.stringify(data),
    })
};
