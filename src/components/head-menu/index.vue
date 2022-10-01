<template>
    <div class="header-menu-content">
      <div class="header-left-content">
         <div class="header-title">个人博客后台管理系统</div>
      </div>
      <div class="parsonal-center-content">
        <div class="parsonal-center-title">
           <div class="el-icon-setting"><span style="margin-left:5px">设置</span></div> 
           <div class="setting-item">
                <div @click="modifiyPwd">修改密码</div>
                <div @click="loginOut">退出登录</div>
           </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
    data(){
        return{}
    },
    created(){

    },
    computed:{
        userName(){
            return this.$store.state.username||'';
        }
    },
    methods:{
        modifiyPwd(){
            this.$emit("modifiyPwd")
        },
        loginOut(){
            this.$emit("loginOut")
        },
    }
}
</script>

<style lang="scss" scoped>
.header-menu-content{
    display: flex;
    justify-content: space-between;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 64px;
    line-height: 64px;
    padding: 0 50px;
    background:#001529;
    z-index: 100;
    color: #fff;
    .header-left-content{
        .header-logo{
            width: 120px;
            height: 31px;
            margin: 16px 24px 16px 0;
            background: rgba(255,255,255,.3);
        }
        .header-title{
            font-size: 20px;
        }
    }
    .parsonal-center-content{
        width: 100px;
        text-align: right;
        .user-avatar{
            display: flex;
            .avatar-img{
                width: 60px;
                height: 60px;
                margin: 2px 10px 2px 0;
                border-radius: 50%;
                background:red;
            }
        }
        .parsonal-center-title{
            cursor: pointer;
            .setting-item{
                display: none;
            }
            &:hover{
                .setting-item{
                    display: block;
                    width:100px;
                    line-height: 45px;
                    padding-right:50px;
                    padding-left: 10px;
                    position: absolute;
                    background: #fff;
                    color: #000;
                    box-shadow: 3px 3px 9px #ccc;
                }
            }
        }
    }
}
</style>