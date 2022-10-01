<template>
  <div class="review-content">
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
          <el-form-item label="评论文章">
            <el-input v-model="ruleForm.title" placeholder="请输入文章标题"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :getter="40">
        <el-col :span="11">
          <el-form-item label="评论人名称">
            <el-input v-model="ruleForm.rauthor" placeholder="请输入用户名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="评论日期">
            <el-date-picker
              v-model="ruleForm.rtime"
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
          <el-button type="primary" @click="getReviewList">查询</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div>
      <ui-table 
        :data="reviewList" 
        :columns="columns"
        :total="total"
        :pagination="true"
        :serial="false"
        @pageChange="handlePageChange">
        <template v-slot:rtime="{row}">
          <div>{{row.rtime&&handleFormateDate(row.rtime)}}</div>
        </template>
        <template v-slot:operate="{row}">
          <el-button type="text" @click="detail(row)">详情</el-button>
          <el-button type="text" @click="remove(row)">删除</el-button>
        </template>
      </ui-table>
    </div>
    <el-dialog
      title="评论详情"
      :visible.sync="reviewVisible"
      width="500px"
      :modal-append-to-body="false"
      :before-close="handleClose">
      <el-form
        :model="detailInfo"
        label-width="100px"
        label-position="right">
        <el-form-item label="文章类型:"> 
            <div>{{detailInfo.cname||'--'}}</div>
        </el-form-item>
        <el-form-item label="评论文章:"> 
            <div>{{detailInfo.title||'--'}}</div>
        </el-form-item>
        <el-form-item label="评论人名称:"> 
            <div>{{detailInfo.rauthor||'--'}}</div>
        </el-form-item>
        <el-form-item label="评论日期:"> 
            <div>{{detailInfo.rtime&&handleFormateDate(detailInfo.rtime)||'--'}}</div>
        </el-form-item>
        <el-form-item label="评论内容:"> 
            <div>{{detailInfo.rcontent||'--'}}</div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" style="text-align:center">
        <el-button type="primary" size="small" @click="reviewVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import UiTable from '@/components/ui-table'
import moment from 'moment'
import { reviewList,deleteReview,detailReview} from '@/api/review'
import{categoryOption} from '@/api/category'
export default {
    name:"Review",
    components:{
      UiTable
    },
    data(){
      return{
        reviewList:[],
        detailInfo:{},
        pageSize:5,
        currentPage:1,
        total:0,
        reviewVisible:false,
        articleTypeOptions:[],
        ruleForm:{
          cid:'',
          title:'',
          rauthor:'',
          rtime:[],
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
              label:"评论文章",
            },
          },
          {
            bind:{
              prop:"rauthor",
              label:"评论人名称",
            }
          },{
            bind:{
              prop:"rcontent",
              label:"评论内容",
              showOverflowTooltip:true,
            },
          },{
            bind:{
              prop:"rtime",
              label:"评论日期",
            },
            slotName:'rtime'
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
      this.getReviewList();
      this.getCategoryOptions();
    },
    methods:{
      getCategoryOptions(){
        categoryOption().then(res=>{
          if(res.statusCode==='000000'){
            this.articleTypeOptions=res.list||[];
          }
        })
      },
      // 重置
      handleReset(){
        for(let key in this.ruleForm){
          this.ruleForm[key]='';
        }
      },
      async getReviewList(){
        await reviewList({
          cid:this.ruleForm.cid||'',
          title:this.ruleForm.title||'',
          rauthor:this.ruleForm.rauthor||'',
          sTime:this.ruleForm.rtime[0],
          eTime:this.ruleForm.rtime[1],
          pageSize:this.pageSize,
          currentPage:this.currentPage,
        }).then(res=>{
          if(res.statusCode==='000000'){
            this.reviewList=res.list||[];
            this.total=Number(res.total)||0;
          }
        }).catch(err=>{})
      },
      detail(row){
        detailReview(row).then(res=>{
          if(res.statusCode==='000000'){
            this.reviewVisible=true;
            this.detailInfo=res.list||{};
          }else{
            this.getMessageBox("获取评论详情数据失败",'error')
          }
        }).catch(err=>{
          if(err){
            this.getMessageBox("获取评论详情数据失败",'error')
          }
        })
      },
      remove(row){
        this.$confirm('此操作将永久删除该条数据, 是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type:'warning',
        }).then(res=>{
          this.removeConfirm(row);
        }).catch(err=>err)
      },
      removeConfirm(data){
        deleteReview(data).then(res=>{
          if(res.statusCode==='000000'){
            this.getMessageBox('删除成功','success');
            this.getReviewList();
          }else{
            this.getMessageBox('删除失败','error');
          }
        }).catch(err=>{
          if(err){
            this.getMessageBox('删除失败','error');
          }
        })
      },
      // 分页处理
      handlePageChange(val){
        this.pageSize=val.pageSize;
        this.currentPage=val.page;
        this.getReviewList();
      },
      handleClose(){
        this.reviewVisible = false;
      },
      // 格式化时间
      handleFormateDate(date){
        return moment(date).format('YYYY-MM-DD');
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
  .review-content{
    margin-top: 20px;
    .btn-content{
      margin-bottom: 30px;
      text-align: center;
    }
    .dialog-footer{
      text-align: right !important;
    }
  }

</style>