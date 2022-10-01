<template>
    <div class="blog-detail-content">
        <div class="blog-header-content">
            <div class="blog-title">{{blogInfo.title}}</div>
            <div class="blog-info">
                <span>编号：{{blogInfo.bid}}</span>
                <span class="info-item">作者：{{blogInfo.author}}</span>
                <span>发布时间：{{getFormatDate(blogInfo.sendtime,'send')}}</span>
            </div>
        </div>
        <div>
            <mavon-editor 
              v-model="blogInfo.content"
              class="md"
              :subfield="false"
              :defaultOpen="'preview'"
              :toolbarsFlag="false"
              :editable="false"
              :scrollStyle="true"
              :boxShadow="false"
              :navigation="false"
              :ishljs="true" />
        </div>
        <div class="user-play-content">
            <div class="play-item-content">
                <div class="iconfont icon-good" v-if="!isLike" @click="handleCreateLike">点赞({{likeTotal}})</div>
                <div class="iconfont icon-good like-exist" v-if="isLike">已点赞({{likeTotal}})</div>
                <div class="iconfont icon-favorite" v-if="!isCollect" @click="handleCreateCollect">收藏({{collectTotal}})</div>
                <div class="iconfont icon-favorite collect-exist" v-if="isCollect">已收藏({{collectTotal}})</div>
                <div class="iconfont icon-edit">评论({{reviewTotal}})</div>
            </div>
        </div>
        <div class="blog-review-content">
            <div class="blog-review-title">文章评论({{reviewTotal}})</div>
            <div 
                v-for="item in reviewList" 
                :key="item.rid"
                class="blog-review-item">
                <div class="review-item-author">
                    {{item.rauthor}}:
                </div>
                <div class="review-item-text">
                    <span>{{item.rcontent}}</span>
                </div>
                <div class="review-item-time">时间：{{getFormatDate(item.rtime,'review')}}</div>
            </div>
        </div>
        <div>
            <div style="margin-bottom:5px">填写评论</div>
            <el-input type="textarea" rows="3" v-model="reviewInfo"></el-input>
        </div>
        <div class="btn-content">
            <el-button type="primary" @click="goBack">返回</el-button>
            <el-button type="primary" @click="handlerCreateReview">发布评论</el-button>
        </div>
    </div>
</template>

<script>
import {mavonEditor} from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import moment from 'moment'
import{
    blogDetail,
    blogReview,
    blogDetailTotal,
    blogCollectExist,
    blogLikeExist,
} from '@/api/blog'
import{createReview} from '@/api/review'
import{collectCreate} from '@/api/collect'
import {likeCreate } from '@/api/like';
export default {
    components:{
        mavonEditor
    },
    data(){
        return{
            blogInfo:{
                bid:'',
                cid:'',
                title:'',
                author:'',
                sendtime:'',
                content:'',
                cname:'',
            },
            isCollect:false,
            isLike:false,
            reviewList:[],
            reviewTotal:0,
            likeTotal:0,
            collectTotal:0,
            reviewInfo:'',
        }
    },
    created(){
        const info=this.$route.params||{};
        if(info&&info.bid){
            this.getBlogDetail(info.bid);
            this.getBlogDetailTotal(info.bid);
        }
    },
    methods:{
        // 获取博客详情
        getBlogDetail(id){
            blogDetail({bid:id}).then(res=>{
                if(res.statusCode==='000000'){
                    const info=res.list||{};
                    this.getBlogReview(info.bid);
                    if(Object.keys(info).length>0){
                      for(let key in this.blogInfo){
                        this.blogInfo[key]=info[key];
                      }
                    }
                    this.getBlogCollectExist();
                    this.getBlogLikeExist();
                }else{
                    this.getMessageBox('获取文章详情失败',error);
                }
            }).catch(err=>{
                if(err){
                  this.getMessageBox('获取博客详情失败',error);  
                }
            })
        },
        // 获取博客【评论
        getBlogReview(id){
            blogReview({bid:id}).then(res=>{
                if(res.statusCode==='000000'){
                    this.reviewList=res.list||[];
                    this.reviewTotal=Number(res.total)||0;
                }
            }).catch(err=>{
               this.getMessageBox('获取评论数据失败',error);   
            })
        },
        // 获取博客对应的评论、收藏、点赞
        getBlogDetailTotal(id){
            blogDetailTotal({bid:id}).then(res=>{
                if(res.statusCode==='000000'){
                    this.reviewTotal=res.list[0].rTotal||0;
                    this.likeTotal=res.list[0].uTotal||0;
                    this.collectTotal=res.list[0].cTotal||0;
                }
            }).catch(err=>{

            })
        },
        // 格式化时间
        getFormatDate(date,flag){
            if(flag=='send'){
              return moment(date).format('YYYY-MM-DD');
            }else if(flag=='review'){
              return moment(date).format('YYYY-MM-DD HH:mm:ss');
            }
        },

        // 返回
        goBack(){
            this.$router.go(-1);
        },
        // 查询是否已收藏
        getBlogCollectExist(){
            blogCollectExist({
                bid:this.blogInfo.bid,
                cauthor:this.$store.state.username||'',
            }).then(res=>{
                if(res.statusCode==='000000'){
                    this.isCollect=res.total==1;
                }
            })
        },
        // 查询是否已点赞
        getBlogLikeExist(){
            blogLikeExist({
                bid:this.blogInfo.bid,
                lauthor:this.$store.state.username||'',
            }).then(res=>{
                if(res.statusCode==='000000'){
                    this.isLike=res.total==1;
                }
            })
        },
        // 收藏
        handleCreateCollect(){
            collectCreate({
                cid:this.blogInfo.cid,
                bid:this.blogInfo.bid,
                cauthor:this.$store.state.username||'',
            }).then(res=>{
                if(res.statusCode==='000000'){
                    this.getMessageBox('收藏成功','success');
                    this.getBlogDetailTotal(this.blogInfo.bid);
                    this.getBlogCollectExist();
                }
            }).catch(err=>{
                this.getMessageBox('收藏失败','error');
            })
        },
        // 点赞
        handleCreateLike(){
            console.log(33666);
            likeCreate({
                cid:this.blogInfo.cid,
                bid:this.blogInfo.bid,
                lauthor:this.$store.state.username||'',
            }).then(res=>{
                if(res.statusCode==='000000'){
                    this.getMessageBox('点赞成功','success');
                    this.getBlogDetailTotal(this.blogInfo.bid);
                    this.getBlogLikeExist();
                }
            }).catch(err=>{
                this.getMessageBox('点赞失败','error');
            })
        },
        // 发表评论
        handlerCreateReview(){
            createReview({
                cid:this.blogInfo.cid,
                bid:this.blogInfo.bid,
                rauthor:this.$store.state.username||'',
                rcontent:this.reviewInfo,
                rtime:moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            }).then(res=>{
                if(res.statusCode==='000000'){
                    this.getMessageBox('评论发布成功','success');
                    this.getBlogReview(this.blogInfo.bid);
                    this.getBlogDetailTotal(this.blogInfo.bid);
                }else{
                    this.getMessageBox('评论发布失败','error')
                }
            }).catch(err=>{
                this.getMessageBox(err,'error')
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
    }
}
</script>

<style lang="scss" scoped>
.blog-detail-content{
    padding-right: 20px;
    .blog-header-content{
        .blog-title{
            font-size: 2em;
            font-weight: 600;
            padding: 0.3em 0;
            text-align: center;
        }
        .blog-info{
            font-size: 14px;
            text-align: center;
            .info-item{
                padding: 0 20px;
            }
        }
    }
    .user-play-content{
        background: #fff;
        .play-item-content{
            display: flex;
            justify-content: space-between;
            width: 300px;
            margin-top: 20px;
            padding: 20px;
            .iconfont{
                cursor: pointer;
            }
            .collect-exist,.like-exist{
                cursor: pointer;
                color: rgb(216, 40, 40);
            }
        }
    }
    .blog-review-content{
        margin: 20px 0;
        padding: 20px;
        background: #fff;
        .blog-review-title{
            font-size: 16px;
        }
        .blog-review-item{
            margin: 10px 0;
            .review-item-author{
                font-size: 14px;
                padding-right:5px;
            }
            .review-item-text,.review-item-time{
                padding-left: 15px;
                font-size: 14px;
                color: rgb(85, 81, 81);
            }
            .review-item-text{
                margin: 5px 0;
            }
        }
    }
    
    .btn-content{
        padding: 50px 0 0 0;
        text-align: center;
    }

}
</style>