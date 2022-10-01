<template>
    <div class="user-info-content">
        <div class="main-info">
            <div class="user-img">
                <el-upload
                  class="avatar-uploader"
                  action="api/data/avatar"
                  :before-upload="beforeAvatarUpload"
                  :http-request="handleAvatarUpload"
                  :show-file-list="false"
                  :data="imgInfo">
                  <img v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" class="avatar">
                  <img v-else src="~@/assets/login/avatar.png" class="avatar" alt="">
                </el-upload>
            </div>
            <div class="user-info">
                <div class="user-name">{{userInfo.username||'--'}}</div>
                <div class="user-role">{{manageFlagObj[userInfo.manageFlag]||'--'}}</div>
            </div>
        </div>
        <el-divider></el-divider>
        <div class="login-info">
            <div>上次登录时间：{{handleFormateDate(userInfo.loginTime)}}</div>
        </div>
    </div>
</template>

<script>
import moment from "moment"
import{manageFlagObj} from "@/lib/common"
import {uploadAvatar,userInfo} from '@/api/dataview'
import {getBase64} from '@/lib/utils'
export default {
    data(){
        return{
            manageFlagObj,
            imgInfo:{
                fileName:'',
                fileUrl:'',
            },
            userInfo:{
                avatarUrl:'',
                username:'',
                manageFlag:'',
                loginTime:'',
            }
        }
    },
    created(){
        this.getUserInfo();
    },
    methods:{
        beforeAvatarUpload(file){
            return true;
        },
        handleAvatarUpload(file){
            const imgType=file.file.type.split('/')[1];
            getBase64(file.file).then(resBase64 => {
	 	        const imgBase64 = resBase64.split(',')[1]　　//直接拿到base64信息
                this.handleUploadAvatar(imgType,imgBase64);
	        }) 
        },
        handleUploadAvatar(imgType,imgBase64){
            uploadAvatar({
                imgType,
                imgBase64,
                username:this.$store.state.username||'',
            }).then(res=>{
                this.userInfo.avatarUrl=res.url;
            })
        },
        // 获取用户基本信息
        getUserInfo(){
            userInfo({
                username:this.$store.state.username||'',
            }).then(res=>{
                if(res.statusCode==='000000'){
                    for(let key in this.userInfo){
                        this.userInfo[key]=res.list[key];
                    }
                }
            }).catch(err=>{

            })
        },
        handleFormateDate(date){
            return moment(date).format('YYYY-MM-DD HH:mm:ss');
        },
    }
}
</script>

<style lang="scss" scoped>
.user-info-content{
    width: 100%;
    padding:20px;
    background: #fff;
    box-shadow: 3px 3px 9px #ccc;
    box-sizing: border-box;
    .main-info{
        display: flex;
        .user-img{
            width: 150px;
            height: 150px;
            border-radius: 50%;
            border: 1px solid #ddd;
            .avatar-uploader{
                text-align: center;
                width:150px;
                height:150px;
                line-height: 150px;
                color:#ddd;
                .avatar{
                    width:150px;
                    height:150px;
                    border-radius: 50%;
                }
            }
        }
        .user-info{
            margin-top: 40px;
            flex: 1;
            margin-left: 20px;
            text-align: center;
            .user-name,.user-role{
                font-size: 16px;
                line-height: 30px;
            }
        }
    }
    .login-info{
        line-height: 25px;
        color: rgb(158, 152, 152);
    }
}
</style>