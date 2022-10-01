// 将菜单组成树状结构
function formatMenuList(data){
    const parents=data.filter(p=>p.pid===0);
    const children=data.filter(c=>c.pid!==0);
    dataToTree(parents,children);
    function dataToTree(parents,children){
        parents.map((p)=>{
            children.map((c,i)=>{
                if(c.pid===p.id){
                    const _c=JSON.parse(JSON.stringify(children));
                    _c.splice(i,1);
                    dataToTree([c],_c);
                    if(p.children){
                        p.children.push(c);
                    }else{
                        p.children=[c];
                    }
                }
            })
        })
    };
    return parents;
}
// 将图片转换成base64格式上传到后端
function getBase64(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      let fileResult = "";
      reader.readAsDataURL(file);
　　　     　　//开始转
      reader.onload = function() {
        fileResult = reader.result;
      };
　　　     　　//转 失败
      reader.onerror = function(error) {
        reject(error);
      };
　　　     　　//转 结束  咱就 resolve 出去
      reader.onloadend = function() {
        resolve(fileResult);
      };
    });
}
export {
    formatMenuList,
    getBase64,
}