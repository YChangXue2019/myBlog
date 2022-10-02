<template>
    <div class="login-page">
        <div class="login-content">
            <div class="login-img">
                <div class="img-content"><img src="@/assets/login/user_icon.png" alt=""></div>
                <h3 class="login-title">个人博客管理中心</h3>
            </div>
            <form class="login-form">
                <h3 class="login-form-title">登录</h3>
                <div class="login-input-content">
                    <div class="login-input-itme">
                        <label class="label-item" for="userName">账户：</label>
                        <input type="text"  class="input-item" id="userName" v-model="userName" placeholder='请输入账户'/>
                    </div>
                    <div class="login-input-itme pasw">
                        <label class="label-item" for="userPwd">密码：</label>
                        <input type="password"  class="input-item" id="userPwd" v-model="userPwd" placeholder='请输入密码'/>
                    </div>
                    <div class="login-btn" @click="login">登录</div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { userLogin } from '@/api/user'
import moment from 'moment'
export default {
    name:'Login',
    components:{

    },
    data(){
        return{
            userName:'',
            userPwd:'',
            remFlag:'',
        }
    },
    methods:{
        login(){
            userLogin({
                username:this.userName||'',
                password:this.userPwd||'',
                loginTime:moment(new Date()).format('YYYY-MM-dd HH:mm:ss'),
            }).then(res=>{
                if(res.statusCode==='000000'){
                    this.$store.commit("setToken",res.token);
                    this.$store.commit('setUsername',this.userName);
                    this.$router.push({
                        name:'layout'
                    })
                    this.getMessageBox(`欢迎您 ${this.userName}`,'success');
                }else{
                  this.getMessageBox(res.message,'error');  
                }
            }).catch(err=>{
                this.getMessageBox(err,'error');
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
.login-page{
    position:fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgb(42, 37, 38);
    .login-content{
        display: flex;
        justify-content: space-around;
        width: 600px;
        border-radius: 5px;
        margin:10% auto;
        background: #fff;
        text-align: center;
    }
}

.login-img{
    position: relative;
    width: 250px;
    background: #000;
    opacity:0.5;
    border-radius: 5px 0 0 5px;
}
.img-content{
   position: absolute;
   width: 100px;
   height: 100px;
   top: 25%;
   /* bottom: 0; */
   left: 0;
   right: 0;
   margin: auto;
   border-radius: 50%; 
   background: #fff;
}
.login-title{
    position: absolute;
    bottom: 80px;
    left: 0; 
    right: 0;
    margin: auto;
    color: white;
}
.img-content img{
    width: 50%;
    height: 50%;
    margin:25% auto;
}
.login-form{
    padding: 40px;
    flex: 1;
    text-align: center;
}
.login-form-title{
    font-weight: 500;
    padding-bottom: 20px;
}
.login-input-itme{
    display: flex;
    margin-bottom: 30px;
    border-bottom: 2px rgb(102, 96, 96) solid;
}
.label-item{
    width: 60px;
    text-align: left;
}
.input-item{
    flex: 1;
    border: none;
    outline: none;
}
.login-btn{
    width:150px ;
    height: 30px;
    line-height: 30px;
    border-radius: 15px;
    margin:20px auto 0;
    background: red;
    color: white;
    cursor: pointer;
}
.pasw{
    margin-bottom: 0;
}
.login-pwd-item{
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}
.forgit-paw{
    cursor: pointer;
}
</style>