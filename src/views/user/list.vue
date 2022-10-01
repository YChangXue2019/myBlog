<template>
  <div class="user-content">
    <el-form 
    :model="qryForm"
    label-width="170px">
      <el-row>
        <el-col :span="11">
          <el-form-item label="用户名称">
            <el-input v-model="qryForm.username" placeholder="请输入用户名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="用户角色">
            <el-select
              v-model="qryForm.manageFlag"
              style="width:100%"
              placeholder="请选择用户角色">
              <el-option label="管理员" value="1"></el-option>
              <el-option label="普通用户" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="btn-content">
          <el-button @click="handleReset">重置</el-button>
          <el-button type="primary" @click="getUserList">查询</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div>
      <ui-table 
        :data="userList" 
        :columns="columns"
        :total="total"
        :pagination="true"
        :serial="false"
        @pageChange="handlePageChange">
        <template v-slot:avatarUrl="{row}">
          <!-- <div>{{row.avatarUrl||'--'}}</div> -->
          <div>
            <el-button type="text" @click="readAvatarImg(row.avatarUrl)">查看</el-button>
          </div>
        </template>
        <template v-slot:manageFlag="{row}">
          <div>{{row.manageFlag&&manageFlagObj[row.manageFlag]||'--'}}</div>
        </template>
        <template v-slot:createAt="{row}">
          <div>{{row.createAt&&handleFormateDate(row.createAt)||'--'}}</div>
        </template>
        <template v-slot:loginTime="{row}">
          <div>{{row.loginTime&&handleFormateDate(row.loginTime)||'--'}}</div>
        </template>
        <template v-slot:operate="{row}">
          <el-button type="text" @click="modifiy(row)">修改</el-button>
          <el-button type="text" @click="remove(row)">删除</el-button>
        </template>
      </ui-table>
    </div>
    <div class="btn-content">
      <el-button type="primary" @click="create">新增</el-button>
    </div>
    <el-dialog
      :title="operateTitle"
      :visible.sync="modifiyVisible"
      :modal-append-to-body="false"
      :align="'center'"
      width="500px"
      :before-close="handleClose">
      <div v-if="avatarFlag">
        <img :src="avatarUrl" alt="" class="avatar">
      </div>
      <el-form 
        v-else
        :model="ruleForm" 
        :rules="rules" 
        ref="ruleForm" 
        label-width="100px">
        <el-form-item label="用户名称:" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item v-if="operateType!='modifiy'" label="用户密码:" prop="password">
           <el-input type="password" v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item v-if="operateType!='modifiy'" label="确认密码:" prop="confrimPassword">
           <el-input type="password" v-model="ruleForm.confrimPassword"></el-input>
        </el-form-item>
        <el-form-item label="用户角色:" prop="manageFlag">
          <el-select v-model="ruleForm.manageFlag" style="width:100%">
            <el-option value="1" label="管理员"/>
            <el-option value="0" label="普通用户"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" v-if="!avatarFlag" @click="handleClose">取 消</el-button>
        <el-button size="small" v-if="!avatarFlag" type="primary" @click="handleFormVerify('ruleForm')">确 定</el-button>
        <el-button size="small" v-if="avatarFlag" type="primary" @click="handleClose">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {userList,createUser,updateUser,deleteUser,usereExist} from "@/api/user"
import{manageFlagObj} from "@/lib/common"
import UiTable from "@/components/ui-table"
import moment from 'moment'
export default {
    name:"UserList",
    components:{
      UiTable,
    },
    data(){
      const validateConPass = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入确认密码'));
        } else {
          const len=this.ruleForm.confrimPassword.length;
          if (len<6||len>18) {
            callback(new Error('密码长度应在 6 到 18 个字符'));
          }else{
            const passValue=this.ruleForm.password;
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
        manageFlagObj,
        userList:[],
        total:0,
        pageSize:5,
        currentPage:1,
        modifiyVisible:false,
        operateTitle:'',
        operateType:'',
        removeId:'',
        avatarUrl:'',
        qryForm:{
          username:'',
          manageFlag:'',
        },
        ruleForm:{
          id:'',
          username:'',
          password:'',
          confrimPassword:'',
          manageFlag:'',
          reateAt:'',
          avatarUrl:'',
          loginTime:'',
        },
        oldInfo:{},
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
              prop:"username",
              label:"用户名",
            },
          },
         {
            bind:{
              prop:"manageFlag",
              label:"用户角色",
            },
            slotName:'manageFlag'
          },
          {
            bind:{
              prop:"avatarUrl",
              label:"用户头像",
            },
            slotName:'avatarUrl'
          },
          {
            bind:{
              prop:"createAt",
              label:"注册时间",
            },
            slotName:'createAt'
          },
          {
            bind:{
              prop:"loginTime",
              label:"上次登录时间",
            },
            slotName:'loginTime'
          },
          {
            bind:{
              label:"操作",
              width:100,
            },
            slotName:'operate'
          }
        ],
        rules:{
          username:[
            { required: true, message: '请输入用户名称', trigger: 'blur' },
            { min: 1, max: 10, message: '用户名长度应在 1 到 10 个字符', trigger: 'blur' }
          ],
          password:[
            { required: true, message: '请输入用户密码', trigger: 'blur' },
            { min: 6, max: 18, message: '密码长度应在 6 到 18 个字符', trigger: 'blur' }
          ],
          confrimPassword:[
            { required: true, validator:validateConPass, trigger: 'blur' },
          ],
          manageFlag:[
            { required: true, message: '请选择是管理员标志', trigger: 'change' },
          ]
        }
      }
    },
    created(){
      this.getUserList();
    },
    methods:{
      // 重置
      handleReset(){
        for(let key in this.qryForm){
          this.qryForm[key]='';
        }
      },
      // 查询用户列表
      async getUserList(){
        await userList({
          username:this.qryForm.username||'',
          manageFlag:this.qryForm.manageFlag||'',
          pageSize:this.pageSize,
          currentPage:this.currentPage,
          token:this.$store.state.token,
        }).then(res=>{
          if(res.statusCode==='000000'){
            this.userList=res.list||[];
            this.total=Number(res.total)||0;
          }else{
            this.getMessageBox("获取用户列表失败",'error')
          }
        }).catch(err=>{
          if(err){
            this.getMessageBox("获取用户列表失败",'error')
          }
        })
      },
      // 查看用户头像
      readAvatarImg(url){
        if(url){
          this.operateTitle='用户头像';
          this.modifiyVisible=true;
          this.avatarFlag=true;
          this.avatarUrl=url;
        }else{
          this.getMessageBox("该用户尚未上传头像，暂无法查看！",'warning');
        }
      },
      // 分页处理
      handlePageChange(val){
        this.pageSize=val.pageSize;
        this.currentPage=val.page;
        this.getUserList();
      },
      modifiy(row){
        this.modifiyVisible=true;
        this.avatarFlag=false;
        this.operateTitle='修改用户';
        this.operateType='modifiy';
        this.oldInfo=row||{};
        this.ruleForm.username=row.username;
        this.ruleForm.manageFlag=row.manageFlag;
        this.ruleForm.id=row.id;
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
        deleteUser(data).then(res=>{
          if(res.statusCode==='000000'){
            this.getMessageBox("删除成功",'success');
            this.getUserList();
          }else{
            this.getMessageBox("删除失败",'error')
          }
        }).catch(err=>{
          if(err){
            this.getMessageBox("删除失败",'error')
          }
        })
      },
      modifiyConfirm(data){
        updateUser(data).then(res=>{
          if(res.statusCode==='000000'){
            this.getMessageBox("修改成功",'success');
            this.handleClose();
            this.getUserList();
          }else{
            this.getMessageBox("修改失败",'error')
          }
          this.modifiyVisible=false;
        }).catch(err=>{
          if(err){
            this.getMessageBox("修改失败",'error')
          }
          this.modifiyVisible=false;
        })
      },
      // 新增用户
      create(){
        this.modifiyVisible=true;
        this.avatarFlag=false;
        this.operateTitle='新增用户';
        this.operateType='add';
      },
      // 确认新增
      createConfirm(data){
        createUser(data).then(res=>{
          if(res.statusCode==='000000'){
            this.getMessageBox("新增成功",'success');
            this.handleClose();
            this.getUserList();
          }else{
            this.getMessageBox("新增失败",'error');
          }
          this.modifiyVisible=false;
        }).catch(err=>{
          if(err){
            this.getMessageBox("新增失败",'error');
          }
          this.modifiyVisible=false;
        })
      },
      // 判断用户是否已存在
      handleUsereExist(data){
        return usereExist(data).then(res=>{
          if(res.statusCode==='000000'&&res.list.username===data.username){
            if(this.operateType==='add'){
              return true;
            }else if(this.operateType==='modifiy'){
              if(this.oldInfo.username===data.username){
                return false;
              }else{
                return true;
              }
            }
          }else{
            return false;
          }
        }).catch(err=>{
          if(err){
           return false;
          }
        });
      },
      handleFormVerify(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.handleUsereExist(this.ruleForm).then(res=>{
              if(res){
                this.getMessageBox("该用户名已存在，请重新输入",'warning');
                this.handleClose();
              }else{
                if(this.operateType==='modifiy'){
                  this.modifiyConfirm(this.ruleForm);
                }else{
                  this.createConfirm(this.ruleForm);
                }
              }
            }).catch(err=>err);
          } else {
            return false;
          }
        });
      },
      handleClose(){
        this.modifiyVisible=false;
        this.avatarFlag=false;
        for(let key in this.ruleForm){
          this.ruleForm[key]='';
        };
        this.$nextTick(()=>{
          this.$refs.ruleForm.clearValidate();
        })
      },
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
  .user-content{
    margin-top: 50px;
    .btn-content{
      margin-bottom: 30px;
      text-align: center;
    }
    .avatar{
      width: 100%;
      height: 100%;
    }
  }

</style>