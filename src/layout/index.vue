<template>
    <div v-loading="loading">
        <el-container class="layout-content">
          <el-header>
            <head-menu @loginOut="loginOut" @modifiyPwd="modifiyPwd"></head-menu>
          </el-header>
          <el-container class="layout-main-content">
            <el-aside style="width:200px;margin-top: 70px;">
                <sider-menu 
                  @changeMenu="changeMenu"
                  :siderMenuOptions="siderMenuOptions"
                ></sider-menu>
            </el-aside>
            <el-main>
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item 
                        v-for="(item,index) in breadList" 
                        :key="index" 
                        :to="item.path">
                        {{item.meta.title}}
                    </el-breadcrumb-item>
                </el-breadcrumb>
                <el-main class="main-content">
                    <router-view></router-view>
                </el-main>
            </el-main>
          </el-container>
        </el-container>
        <el-dialog
          title="提示"
          :visible.sync="loginOutVisible"
          width="400px"
          :before-close="handleClose">
          <span>您确定要退出登录吗？</span>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="loginOutVisible = false">取 消</el-button>
            <el-button size="small" type="primary" @click="loginOutConfirm">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog
          title="修改密码"
          :visible.sync="modifiyPwdVisible"
          width="400px"
          :align="'center'"
          :before-close="handleClose">
          <div>
            <el-form 
                label-width="80px"
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm">
                <el-form-item label="原密码" prop="oldPwd">
                    <el-input type="password" v-model="ruleForm.oldPwd"  placeholder="请输入原密码"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPwd">
                    <el-input type="password" v-model="ruleForm.newPwd" placeholder="请输入新密码"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="newPwdConf">
                    <el-input type="password" v-model="ruleForm.newPwdConf" placeholder="请确认新密码"></el-input>
                </el-form-item>
            </el-form>
          </div>
          <span slot="footer" class="dialog-footer" style="text-align:right">
            <el-button size="small" @click="handleClose">取 消</el-button>
            <el-button size="small" type="primary" @click="handleFormVerify('ruleForm')">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script>
import HeadMenu from '@/components/head-menu'
import SiderMenu from '@/components/sider-menu'
import{modifiyPwd} from '@/api/user'
import {formatMenuList} from '@/lib/utils'
import{menuList} from '@/api/common'
export default {
    name:'Layout',
    components:{
        HeadMenu,
        SiderMenu,
    },
    data(){
        const validateConPass = (rule, value, callback) => {
            if (!value) {
              callback(new Error('请输入确认密码'));
            } else {
              const len=value.length;
              if (len<6||len>18) {
                callback(new Error('密码长度应在 6 到 18 个字符'));
              }else{
                const passValue=this.ruleForm.newPwd;
                if(passValue===value){
                  callback();
                }else{
                  callback(new Error('两次密码不一致，请确认'));
                }
              }
              callback();
            }
      };
        return{
          loading:false,
          loginOutVisible:false,
          modifiyPwdVisible:false,
          siderMenuOptions:[],
          userName:'',
          ruleForm:{
              newPwdConf:'',
              oldPwd:'',
              newPwd:'',
          },
          rules:{
            oldPwd:[
              { required: true, message: '请输入原密码', trigger: 'blur' },
            ],
            newPwd:[
              { required: true, message: '请输入新密码', trigger: 'blur' },
              { min: 6, max: 18, message: '密码长度应在 6 到 18 个字符', trigger: 'blur' }
            ],
            newPwdConf:[
              { required: true, validator:validateConPass, trigger: 'blur' },
            ],
          }
        }
    },
    computed:{
        breadList(){
           const list=this.$route.matched||[];
           return list.filter((item)=>item.name!=='layout');
        }
    },
    created(){
      this.handleFormatMenu();
    },
    methods:{
      //获取菜单数据
      async handleFormatMenu(){
        this.loading=true;
        await menuList().then(res=>{
          this.loading=false;
          if(res.statusCode==='000000'){
              if(res.list&&res.list.length>0){
                  this.siderMenuOptions=formatMenuList(res.list);
                  console.log(this.siderMenuOptions);
              }
          }
        }).catch(err=>{
          this.loading=false;
        })
        this.loading=false;
      },
      loginOut(){
          this.loginOutVisible=true;
      },
      loginOutConfirm(){
          this.$store.commit('removeToken','');
          this.$store.commit('removeUsername','');
          this.$router.push({
              name:'login'
          })
      },
      
      modifiyPwd(){
          this.modifiyPwdVisible=true;
      },
      // 表单校验
      handleFormVerify(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.modifiyPwdConfirm();
            } else {
              return false;
            }
          });
      },
      modifiyPwdConfirm(){
          modifiyPwd({
              ...this.ruleForm,
              username:this.$store.state.username||'',
          }).then(res=>{
              if(res.statusCode==='000000'){
                  this.$message.success(res.message);
                  this.$router.push({
                      name:'login'
                  })
              }else{
                  this.getMessageBox(res.message,'error');   
              }
          }).catch(err=>{
              this.getMessageBox(res.message,'error');
          })
      },
      handleClose(){
          this.loginOutVisible=false;
          this.modifiyPwdVisible=false;
          for(let key in this.ruleForm){
              this.ruleForm[key]='';
          }
          this.$nextTick(()=>{
            this.$refs.ruleForm.clearValidate();
          })
      },
      getMessageBox(tipInfo,type){
          this.$confirm(tipInfo, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type:type
          })
      },
      changeMenu(val){
          this.$router.push({
              name:val
          })
      }
    }
}
</script>

<style lang="scss" scoped>
.layout-content{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: #f0f2f5;
    .layout-main-content{
        flex: 1;
        height: 100vh;
        // margin-top:60px;
        .main-content{
            // background: rgb(255, 255, 255); 
            margin: 20px 0; 
            padding: 0 0px 150px 0px;
            height: 100vh;
            overflow: auto;
        }
    }
}
</style>