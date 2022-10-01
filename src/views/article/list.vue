<template>
  <div class="blog-content">
    <el-form
      :model="ruleForm"
      ref="ruleForm"
      label-width="170px">
      <el-row :gutter="40">
        <el-col :span="11">
          <el-form-item label="文章类别">
            <el-select
              v-model="ruleForm.cid"
              placeholder="请选择文章类别"
              style="width: 100%;">
              <el-option 
                v-for="item in articleTypeOptions" 
                :key="item.cid"
                :label="item.cname"
                :value="item.cid"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item 
            label="文章标题">
            <el-input 
              v-model="ruleForm.title"
              placeholder="请输入文章标题"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="11">
          <el-form-item 
              label="文章作者">
            <el-input 
              v-model="ruleForm.author"
              placeholder="请输入文章作者"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="发布日期" prop="">
            <el-date-picker
              v-model="ruleForm.sendTime"
              type="daterange"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width:100%">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="btn-content">
          <el-button @click="handleReset">重置</el-button>
          <el-button type="primary" @click="handleFormVerfiy('ruleForm')">查询</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div v-loading="loading">
      <ui-table 
        :data="blogList" 
        :columns="columns"
        :total="total"
        :pagination="true"
        :serial="false"
        @pageChange="handlePageChange">
        <template v-slot:sendtime="{row}">
          <div>{{handleFormateDate(row.sendtime,'send')}}</div>
        </template>
        <template v-slot:modifiytime="{row}">
          <div>{{row.modifiytime&&handleFormateDate(row.modifiytime,'edit')||'--'}}</div>
        </template>
        <template v-slot:operate="{row}">
          <el-button type="text" @click="detail(row)">详情</el-button>
          <el-button type="text" @click="modifiy(row)">修改</el-button>
          <el-button type="text" @click="remove(row)">删除</el-button>
        </template>
      </ui-table>
    </div>
  </div>
</template>

<script>
import {blogList,deleteBlog} from '@/api/blog'
import{categoryOption} from '@/api/category'
import {menuList} from '@/api/user'
import {formatMenuList} from '@/lib/utils'
import UiTable from '@/components/ui-table'
import moment from 'moment'
export default {
    name:"ArticleList",
    components:{
      UiTable
    },
    data(){
      return{
        loading:false,
        catrgoryList:[],
        blogList:[],
        total:0,
        pageSize:5,
        currentPage:1,
        articleTypeOptions:[],
        ruleForm:{
          cid:'',
          title:'',
          author:'',
          sendTime:[],
          sTime:'',
          eTime:'',
        },
        columns:[
          {
            bind:{
              type:'index',
              label:"序号",
              width:"50",
            }
          },
          {
            bind:{
              prop:"cname",
              label:"类别",
            }
          },
          {
            bind:{
              prop:"title",
              label:"标题",
            }
          },
          {
            bind:{
              prop:"author",
              label:"作者",
            }
          },
          {
            bind:{
              prop:"sendtime",
              label:"发布日期",
            },
            slotName:'sendtime',
          }, {
            bind:{
              prop:"modifiytime",
              label:"最近修改时间",
            },
            slotName:'modifiytime',
          },
          {
            bind:{
              label:"操作",
              width:150,
            },
            slotName:'operate'
          }
        ]
      }
    },
    created(){
      this.getBlogList(this.pageSize,this.currentPage);
      this.getCategoryOptions();
    },
    methods:{
      // 查询分类选项
      getCategoryOptions(){
        categoryOption().then(res=>{
          if(res.statusCode==='000000'){
            this.articleTypeOptions=res.list||[];
          }
        })
      },
      // 表单校验
      handleFormVerfiy(ruleName){
        this.$refs[ruleName].validate((valid) => {
          if (valid) {
            this.getBlogList(this.pageSize,this.currentPage);
          } else {
            return false;
          }
        });
      },
      // 获取列表数据
      async getBlogList(pageSize,currentPage){
        this.loading=true;
        await blogList({
          pageSize,
          currentPage,
          cid:this.ruleForm.cid||'',
          title:this.ruleForm.title||'',
          author:this.ruleForm.author||'',
          sTime:this.ruleForm.sendTime[0]||'',
          eTime:this.ruleForm.sendTime[1]||'',
        }).then(res=>{
          this.loading=false;
          if(res.statusCode==='000000'){
            this.total=Number(res.total)||0;
            this.blogList=res.list||[];
          }
        }).catch(err=>{
          this.loading=false;
        })
      },
      // 重置
      handleReset(){
        for(let key in this.ruleForm){
          this.ruleForm[key]='';
        }
      },
      // 处理分页
      handlePageChange(val){
        this.pageSize=val.pageSize;
        this.currentPage=val.page;
        this.getBlogList(this.pageSize,this.currentPage);
      },
      // 详情
      detail(row){
        this.$router.push({
          name:'articleDetail',
          params:row
        })
      },
      // 修改
      modifiy(row){
        this.$router.push({
          name:'articleSend',
          params:{
            ...row,
            operateFlag:'modifiy'
          }
        })
      },
      // 删除
      remove(row){
        this.$confirm('此操作将永久删除该篇文章及相关的所有数据, 是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type:'warning',
        }).then(res=>{
          this.removeConfirm(row);
        }).catch(err=>err)
      },
      removeConfirm(row){
        deleteBlog(row).then(res=>{
          if(res.statusCode==='000000'){
            this.getMessageBox('删除成功','success');
            this.getBlogList(this.pageSize,this.currentPage);
          }else{
            this.getMessageBox('删除失败','error')
          }
        }).catch(err=>{
          if(err){
            this.getMessageBox('删除失败','error')
          }
        })
      },
      // 时间格式化
      handleFormateDate(date,flag){
        if(flag=='send'){
          return moment(date).format('YYYY-MM-DD');
        }else if(flag=='edit'){
          return moment(date).format('YYYY-MM-DD HH:mm:ss');
        }
      },
      // 调用confirm弹窗
      getMessageBox(tipInfo,type){
        this.$confirm(tipInfo, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type:type
        })
      },
      // 获取菜单
      getMenuList(){
        menuList({
          id:1,
        }).then(res=>{
          const menuList=formatMenuList(res.data);
          console.log(menuList);
          console.log(res);
        }).catch(err=>{

        })
      }
    }
}
</script>

<style lang="scss" scoped>
.blog-content{
  margin-top: 20px;
  .btn-content{
    margin-bottom: 30px;
    text-align: center;
  }
}
</style>