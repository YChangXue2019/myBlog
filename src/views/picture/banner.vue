<template>
  <div>
    <ui-table 
      :data="bannerInfo" 
      :columns="columns"
      :total="total"
      :pagination="true"
      :serial="false"
      @pageChange="handlePageChange">
      <template v-slot:bannerUrl="{row}">
        <div>
          <el-button type="text" @click="readeBannerImg(row.bannerUrl)">查看</el-button>
        </div>
      </template>
      <template v-slot:btime="{row}">
        <div>{{row.btime&&handleFormateDate(row.btime)}}</div>
      </template>
      <template v-slot:operate="{row}">
        <el-button type="text" @click="handleRemove(row)">删除</el-button>
      </template>
    </ui-table>
    <div class="btn-content">
        <el-button type="primary" @click="handleAddBanner">新增</el-button>
    </div>
    <el-dialog
      :title="titleInfo"
      :visible.sync="bannerVisible"
      :modal-append-to-body="false"
      :align="'center'"
      width="500px"
      :before-close="handleClose">
      <div class="banner-img">
        <el-upload
          v-if="!showImgBase64"
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :http-request="handleAvatarUpload"
          :before-upload="beforeAvatarUpload">
          <img v-if="bannerUrl&&showImgFlag==='edit'" :src="bannerUrl" class="avatar"></img>
          <i v-if="showImgFlag==='add'" class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div v-if="showImgBase64">
          <img v-if="showImgBase64" :src="showImgBase64" alt="" class="showImg">
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" v-if="showImgFlag==='look'"  @click="handleClose">取消</el-button>
        <el-button size="small" v-if="showImgFlag==='add'"  @click="handleClose">取消</el-button>
        <el-button size="small" type="primary" v-if="showImgFlag==='add'"  @click="handleAvatarUploadConfirm">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import UiTable from '@/components/ui-table'
import moment from 'moment'
import {getBase64} from '@/lib/utils'
import {uploadBanner,bannerList,deleteBanner} from '@/api/banner'
export default {
  components:{
    UiTable,
  },
  data(){
      return{
        bannerVisible:false,
        titleInfo:'',
        bannerUrl:'',
        bannerInfo:[],
        total:0,
        imgBase64:'',
        imgType:'',
        showImgBase64:'',
        showImgFlag:'',
        currentPage:1,
        pageSize:5,
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
              prop:"bannerUrl",
              label:"图片",
            },
            slotName:'bannerUrl'
          },{
            bind:{
              prop:"bauthor",
              label:"添加人名称",
            },
          },{
            bind:{
              prop:"btime",
              label:"添加时间",
            },
            slotName:'btime'
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
    this.getBannerList();
  },
  methods:{
    // 获取图片列表
    getBannerList(){
      bannerList({
        currentPage:this.currentPage,
        pageSize:this.pageSize,
      }).then(res=>{
        if(res.statusCode==='000000'){
          this.bannerInfo=res.list||[];
          this.total=res.total;
        }
      }).catch(err=>{

      })
    },
    beforeAvatarUpload(file){
      return true;
    },
    // 图片上传（获取图片的base64）
    handleAvatarUpload(file){
      this.imgType=file.file.type.split('/')[1];
        getBase64(file.file).then(resBase64 => {
          this.showImgBase64=resBase64;
	 	      this.imgBase64 = resBase64.split(',')[1]
	      })
    },
    // 图片上传确认
    handleAvatarUploadConfirm(){
      if(this.imgType&&this.imgBase64){
        uploadBanner({
          bauthor:this.$store.state.username||'',
          imgType:this.imgType,
          imgBase64:this.imgBase64,
        }).then(res=>{
          if(res.url){
            this.handleClose();
            this.getMessageBox('新增成功','success');
            this.getBannerList();
          }
        })
      }else{
        this.$message.error("暂无可上传的图片，请选择需要上传图片");
      }
    },
    // 新增
    handleAddBanner(){
      if(this.bannerInfo.length>=5){
        this.getMessageBox('最多可添加5张banner图，请先删除后再重新添加','warning');
      }else{
        this.bannerVisible=true;
        this.titleInfo='新增图片';
        this.showImgFlag='add';
      }
    },
    // 删除
    handleRemove(row){
      this.$confirm('您确认要删除该条数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type:'warning'
      }).then(res=>{
        this.handleRemoveConfirm(row);
      })
    },
    // 删除确认
    handleRemoveConfirm(row){
      deleteBanner({
        id:row.id,
      }).then(res=>{
        if(res.statusCode==='000000'){
          this.getMessageBox('删除成功','success');
          this.getBannerList();
        }
      })
    },
    // 查看banner图
    readeBannerImg(url){
      if(url){
        this.titleInfo='查看图片';
        this.bannerVisible=true;
        this.showImgBase64=url;
        this.showImgFlag='look';
      }else{
        this.getMessageBox('该图片地址出现问题,暂无法查看','error');
      }
    },
    // 分页操作
    handlePageChange(val){
      this.pageSize=val.pageSize;
      this.currentPage=val.page;
      this.getBannerList(this.currentPage,this.pageSize);
    },
    // 时间格式化
    handleFormateDate(date){
        return moment(date).format('YYYY-MM-DD HH:mm:ss');
    },
    // 关闭弹窗
    handleClose(){
      this.bannerVisible=false;
      this.showImgFlag=false;
      this.showImgBase64='';
      this.titleInfo='';
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
.banner-img{
  .avatar-uploader{
    height: 178px;
    width: 178px;
    line-height: 178px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    font-size: 30px;
    .avatar{
      width: 100%;
      // height: 100%;
    }
  }
  .showImg{
    width: 100%;
  }
}
.btn-content{
  text-align: center;
}
</style>