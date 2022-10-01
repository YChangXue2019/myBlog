<template>
  <div class="like-content">
    <el-form
     :model="ruleForm"
     label-width="170px">
      <el-row :getter="40">
        <el-col :span="11">
          <el-form-item label="文章类型">
            <el-select 
              v-model="ruleForm.cid"
              style="width:100%"
              placeholder="请选择文章类型">
              <el-option 
                v-for="(item,index) in articleTypeOptions" 
                :key="index"
                :value="item.cid"
                :label="item.cname"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="点赞文章">
            <el-input v-model="ruleForm.title" placeholder="请输入文章标题"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :getter="40">
        <el-col :span="11">
          <el-form-item label="点赞人名称">
            <el-input v-model="ruleForm.lauthor" placeholder="请输入用户名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="点赞日期">
            <el-date-picker
              v-model="ruleForm.ltime"
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
          <el-button type="primary" @click="getLikeList">查询</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div>
      <ui-table 
        :data="likeInfo" 
        :columns="columns"
        :total="total"
        :pagination="true"
        :serial="false"
        @pageChange="handlePageChange">
        <template v-slot:ltime="{row}">
          <div>{{row.ltime&&handleFormateDate(row.ltime)}}</div>
        </template>
        <template v-slot:operate="{row}">
          <el-button type="text" @click="remove(row)">删除</el-button>
        </template>
      </ui-table>
    </div>
  </div>
</template>

<script>
import UiTable from '@/components/ui-table'
import moment from 'moment';
import {likeList,deleteLike } from '@/api/like';
import{categoryOption} from '@/api/category'
export default {
    components:{
        UiTable,
    },
    data(){
        return{
            likeInfo:[],
            currentPage:1,
            pageSize:5,
            total:0,
            articleTypeOptions:[],
            ruleForm:{
              cid:'',
              title:'',
              lauthor:'',
              ltime:[],
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
                    label:"文章类型",
                  },
                },
                {
                  bind:{
                    prop:"title",
                    label:"点赞文章",
                  },
                },
                {
                  bind:{
                    prop:"lauthor",
                    label:"点赞人名称",
                  }
                },{
                  bind:{
                    prop:"ltime",
                    label:"点赞日期",
                  },
                  slotName:'ltime'
                },
                {
                  bind:{
                    label:"操作",
                    width:100,
                  },
                  slotName:'operate'
                }
            ],
        }
    },
    created(){
      this.getLikeList();
      this.getCategoryOptions();
    },
    methods:{
      // 文章类别查询
      getCategoryOptions(){
        categoryOption().then(res=>{
          if(res.statusCode==='000000'){
            this.articleTypeOptions=res.list||[];
          }
        })
      },
      //重置
      handleReset(){
          for(let key in this.ruleForm){
            this.ruleForm[key]='';
          }
      },
      // 查询
      getLikeList(){
        likeList({
          currentPage:this.currentPage,
          pageSize:this.pageSize,
          cid:this.ruleForm.cid,
          title:this.ruleForm.title,
          lauthor:this.ruleForm.lauthor,
          sTime:this.ruleForm.ltime[0]||'',
          eTime:this.ruleForm.ltime[1]||'',
        }).then(res=>{
          if(res.statusCode==='000000'){
            this.likeInfo=res.list||[];
            this.total=res.total;
          }
        })
      },
      // 分页处理
      handlePageChange(val){
        this.pageSize=val.pageSize;
        this.currentPage=val.page;
        this.getLikeList();
      },
      // 删除
      remove(row){
        this.$confirm('你确认要删除该条数据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type:'warning'
        }).then(res=>{
          this.removeConfirm(row);
        })
      },
      // 确认删除
      removeConfirm(row){
        deleteLike({
          id:row.id,
        }).then(res=>{
          if(res.statusCode==='000000'){
            this.getMessageBox('删除成功','success');
            this.getLikeList();
          }
        }).catch(err=>{
          this.getMessageBox('删除失败','error');
        })
      },
      // 格式化时间
      handleFormateDate(date){
        return moment(date).format('YYYY-MM-DD HH:mm:ss');
      },
      // 调用confirm弹窗
      getMessageBox(tipInfo,type){
        this.$confirm(tipInfo, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type:type
        })
      },
    }
}
</script>

<style lang="scss" scoped>
.like-content{
    .btn-content{
      margin-bottom: 30px;
      text-align: center;
    }
}
</style>