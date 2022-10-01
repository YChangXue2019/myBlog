<template>
  <div>
    <el-form
        :model="reviewInfo"
        label-width="150px"
        label-position="right">
        <el-form-item label="归属文章:"> 
            <div>{{reviewInfo.title||'--'}}</div>
        </el-form-item>
        <el-form-item label="用户名称:"> 
            <div>{{reviewInfo.rauthor||'--'}}</div>
        </el-form-item>
        <el-form-item label="评论时间:"> 
            <div>{{reviewInfo.rtime&&handleFormateDate(reviewInfo.rtime)||'--'}}</div>
        </el-form-item>
        <el-form-item label="评论内容:"> 
            <div>{{reviewInfo.rcontent||'--'}}</div>
        </el-form-item>
    </el-form>
    <div class="btn-content">
        <el-button type="primary" @click="goBack">返回</el-button>
    </div>
  </div>
</template>

<script>
import { detailReview } from '@/api/review'
import moment from 'moment';
export default {
    name:'ReviewDetail',
    data(){
        return{
            reviewInfo:{},
        }
    },
    created(){
        const info=this.$route.params||{};
        this.getReviewDetail(info);
    },
    methods:{
        // 获取文章详情
        getReviewDetail(data){
            detailReview(data).then(res=>{
                if(res.statusCode==='000000'){
                    this.reviewInfo=res.list||{};
                }else{

                }
            }).catch(err=>{
                if(err){

                }
            })
        },
        // 返回
        goBack(){
            this.$router.go(-1);
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
.btn-content{
    text-align: center;
}
</style>