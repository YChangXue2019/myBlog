<template>
  <div class="send-content">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="文章类别" prop="cid">
        <el-select v-model="ruleForm.cid" style="width:100%">
          <el-option 
            v-for="item in articleTypeOptions" 
            :key="item.cid"
            :label="item.cname"
            :value="item.cid"/>
        </el-select>
      </el-form-item>
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="ruleForm.title" placeholder="请输入文章标题"></el-input>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <mavon-editor
        ref="md"
        :mark="true"
        :code="true" 
        :ishljs="true"
        @imgAdd ='handleAddImg'
        v-model="ruleForm.content" 
        placeholder="请输入文章内容"></mavon-editor>
      </el-form-item>
    </el-form>
    <img :src="imgUrl" alt="">
    <div class="btn-content">
      <el-button  plain style="margin-right:20px" @click="goBack">返回</el-button>
      <el-button type="primary" @click="hanldVerifyForm('ruleForm')">提交</el-button>
    </div>
  </div>
</template>

<script>
import {mavonEditor} from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import {articleTypeObj} from '@/lib/common'
import{createBlog,updateBlog,blogDetail,uploadImg} from '@/api/blog'
import{categoryOption} from '@/api/category'
import moment from 'moment';
export default {
    name:"Send",
    components:{
      mavonEditor
    },
    data(){
      return{
        articleTypeObj,
        articleTypeOptions:[],
        blogTypeTotal:0,
        ruleForm:{
          cid:'',
          bid:'',
          title:'',
          content:'',
          author:'',
          sendtime:'',
          modifiytime:'',
        },
        img_file:[],
        operateFlag:'',
        modifiyId:'',
        rules:{
          cid:[
            { required: true, message: '请选择文章类别', trigger: 'change' },
          ],
          title:[
            { required: true, message: '请输入文章标题', trigger: 'blur' },
            { min: 1, max: 50, message: '标题长度应在 1 到 50 个字符', trigger: 'blur' }
          ],
          content:[
            { required: true, message: '请输入文章内容', trigger: 'change' },
          ],
        },
        imgUrl:'',
      }
    },
    created(){
      const info=this.$route.params||{};
      this.operateFlag=info.operateFlag||'';
      this.modifiyId=info.cid||'';
      this.getCategoryOptions();
      if(info&&info.bid&&info.operateFlag){
        this.getBlogDetail(info.bid);
      }
    },
    methods:{
      //表单校验
      hanldVerifyForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.operateFlag==='modifiy'){
              this.handleModifiyBlog(this.modifiyId,this.ruleForm);
            }else{
              this.handleCreateBlog(this.ruleForm);
            }
          } else {
            return false;
          }
        });
      },
      // 查询分类选项
      getCategoryOptions(){
        categoryOption().then(res=>{
          if(res.statusCode==='000000'){
            this.articleTypeOptions=res.list||[];
          }
        })
      },
      // 新增文章
      handleCreateBlog(data){
        data=this.handleConfirmInfo(data,'add');
        createBlog(data).then(res=>{
          if(res.statusCode==='000000'){
            this.getMessageBox('新增成功','success')
            // this.getBlogTotal(data.type);
          }else{
            this.getMessageBox('新增失败','error')
          }
        }).catch(err=>{
          if(err){
            this.getMessageBox('新增失败','error')
          }
        })
      },
      // 修改文章
      handleModifiyBlog(id,data){
        data=this.handleConfirmInfo(data,'edit');
        updateBlog({
            id,
            ...data,
          }).then(res=>{
            if(res.statusCode==='000000'){
              this.getMessageBox('修改成功','success')
            }else{
              this.getMessageBox('修改失败','error')
            }
        }).catch(err=>{
          if(err){
            this.getMessageBox('修改失败','error')
          }
        })
      },
      // 处理入参
      handleConfirmInfo(data,type){
        const info={};
        if(Object.keys(data).length>0){
          for(let key in data){
            if(key==='author'){
              info[key]=this.$store.state.username||'';
            }else if(key==='content'){
              info[key]=data[key].replace(/\'/g,"''");
            }else if(key==='sendtime'&&type==='add'){
              info[key]=moment(new Date()).format('YYYY-MM-DD');
            }else if(key==='sendtime'&&type==='edit'){
              info[key]=moment(data[key]).format('YYYY-MM-DD');
            }else if(key==='modifiytime'&&type==='edit'){
              info[key]=moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            }else{
               info[key]=data[key];
            }
          }
        }
        return info;
      },
      // 匹配文章类型名
      // handleCatergoryName(type){
      //   let typeName='';
      //   this.articleTypeOptions.forEach(item=>{
      //     if(item.id===type){
      //       typeName=item.categoryName;
      //     }
      //   });
      //   return typeName;
      // },
      handleAddImg(pos,file){
        const imgBase64=file.miniurl.split(';')[1].split(',')[1];
        const imgType=file.type.split('/')[1];
        uploadImg({imgType,imgBase64}).then(res=>{
          this.$refs.md.$img2Url(pos,res.url);
        }).catch(err=>{
          if(err){
            this.getMessageBox('上传图片失败','error');
          }
        });
        // let fileName=`_a${Math.random().toString().slice(2)}.${file.type.split('/')[1]}`;
        // console.log(fileName);
      },
      // 获取文章详情
      getBlogDetail(id){
        blogDetail({bid:id}).then(res=>{
          console.log(res,789);
          if(res.statusCode==='000000'){
            const info=res.list||{};
            if(Object.keys(info).length>0){
              for(let key in this.ruleForm){
                this.ruleForm[key]=info[key];
              }
            }
          }else{
            this.getMessageBox('获取文章详情失败','error');
          }
        }).catch(err=>{
          if(err){
            this.getMessageBox('获取文章详情失败','error');
          }
        })
      },
      // 调用confirm弹窗
      getMessageBox(tipInfo,type){
        this.$confirm(tipInfo, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type:type
        })
      },
      // 返回
      goBack(){
        this.$router.go(-1);
      }
    }
}
</script>

<style lang="scss" scoped>
.send-content{
  padding: 20px 0 0 0;
}
.btn-content{
  margin: 50px 0 0 0;
  text-align: center;
}
</style>