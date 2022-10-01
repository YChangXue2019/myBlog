<template>
  <div class="category-content">
    <el-form
      :model='qryForm'
      label-width="170px"
      class="qry-form">
      <el-row>
        <el-col :offset="5" :span="11">
          <el-form-item label="文章类别">
            <el-select
              v-model="qryForm.cid"
              style="width:100%">
              <el-option
               v-for="(item,index) in articleTypeOptions"
               :key="index"
               :value="item.cid"
               :label="item.cname">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="btn-content">
          <el-button @click="handleReset">重置</el-button>
          <el-button type="primary" @click="getCategoryList">查询</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div v-loading="loading">
      <ui-table 
        :data="categoryList" 
        :columns="columns"
        :total="total"
        :pagination="true"
        :serial="false"
        @pageChange="handlePageChange">
        <template v-slot:operate="{row}">
          <el-button type="text" @click="modifiy(row)">修改</el-button>
          <el-button type="text" @click="remove(row)">删除</el-button>
        </template>
      </ui-table>
      <div class="btn-content">
          <el-button type="primary" @click="addCategory">新增</el-button>
      </div>
    </div>
    <el-dialog
      :title="operateTitle"
      :visible.sync="categoryVisible"
      :modal-append-to-body="false"
      :align="'center'"
      width="500px"
      :before-close="handleClose">
      <el-form 
        :model="ruleForm" 
        :rules="rules" 
        ref="ruleForm" 
        label-width="100px">
        <el-form-item label="类别名称:" prop="cname">
          <el-input v-model="ruleForm.cname" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button size="small" type="primary" @click="handleFormVerify('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import UiTable from '@/components/ui-table'
import moment from 'moment'
import{
  categoryList,
  createCheck,
  deleteCategory,
  createCategory,
  updateCategory,
  categoryOption,
} from '@/api/category'
export default {
    name:'Category',
    components:{
        UiTable,
    },
    data(){
        return{
            loading:false,
            pageSize:5,
            currentPage:1,
            total:0,
            categoryList:[],
            operateTitle:'',
            operateFlag:'',
            categoryVisible:false,
            articleTypeOptions:[],
            qryForm:{
              cid:'',
            },
            ruleForm:{
              cid:'',
              cname:'',
            },
            rules:{
              cname:[
                {required:true,message:'请输入类别名称',trigger:'blur'}
              ]
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
                    label:"文章类别",
                  },
                },
                {
                  bind:{
                    prop:"bTotal",
                    label:"文章数量",
                  }
                },
                {
                  bind:{
                    label:"操作",
                    width:'100',
                  },
                  slotName:'operate'
                }
            ],
        }
    },
    created(){
        this.getCategoryList();
        this.getCategoryOptions();
    },
    methods:{
      // 查询分类选项
      async getCategoryOptions(){
        await categoryOption().then(res=>{
          if(res.statusCode==='000000'){
            this.articleTypeOptions=res.list||[];
          }
        })
      },
      // 重置
      handleReset(){
        for(let key in this.qryForm){
          this.qryForm[key]='';
        }
      },
      // 查询分类列表
      async getCategoryList(){
        this.loading=true;
        await categoryList({
            cid:this.qryForm.cid,
            currentPage:this.currentPage,
            pageSize:this.pageSize,
        }).then(res=>{
          this.loading=false;
          if(res.statusCode==='000000'){
              this.categoryList=res.list||[];
              this.total=Number(res.total)||0;
          }else{
              this.getMessageBox("获取数据失败",'error')
          }
        }).catch(err=>{
          this.loading=false;
          if(err){
              this.getMessageBox("获取数据失败",'error')
          }
        })
      },
      // 新增
      addCategory(){
          this.operateTitle='新增分类';
          this.operateFlag='add';
          this.categoryVisible=true;
      },
      // 新增确认
      addCategoryConfirm(data){
          createCategory(data).then(res=>{
              if(res.statusCode==='000000'){
                  this.getMessageBox("新增成功",'success');
                  this.categoryVisible=false;
                  this.getCategoryList();
                  this.getCategoryOptions();
                  for(let key in this.ruleForm){
                    this.ruleForm[key]="";
                  }
              }else{
                  this.categoryVisible=false;
                  this.getMessageBox(res.message,'error')
              }
          }).catch(err=>{
              if(err){
                  this.categoryVisible=false;
                  this.getMessageBox(res.message,'error')
              }
          })
      },
      // 修改
      modifiy(row){
        this.operateTitle='修改分类';
        this.operateFlag='modifiy';
        this.categoryVisible=true;
        for(let key in this.ruleForm){
          if(Object.keys(row).length>0){
            this.ruleForm[key]=row[key];
          }
        }
      },
      modifiyConfirm(data){
        updateCategory(data).then(res=>{
          if(res.statusCode==='000000'){
            this.getMessageBox("修改成功",'success');
            this.categoryVisible=false;
            this.getCategoryList();
          }else{
            this.categoryVisible=false;
            this.getMessageBox("修改失败",'error');
          }
        }).catch(err=>{
          if(err){
            this.categoryVisible=false;
            this.getMessageBox("修改失败",'error');
          }
        })
      },
      // 删除
      remove(row){
        if(row.bTotal>=1){
          this.getMessageBox(`该文章大类下挂载有${row.bTotal}篇文章，需将挂载文章全部删除后才能删除该条数据`,'warning');
        }else{
          this.$confirm('你确定要删除该条数据？','提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type:'warning'
          }).then(res=>{
            this.removeConfirm(row)
          }).catch(err=>{
        })
        }
      },
      removeConfirm(data){
        deleteCategory(data).then(res=>{
          if(res.statusCode==='000000'){
            this.getMessageBox("删除成功",'success');
            this.getCategoryList();
          }else{
            this.getMessageBox("删除失败",'error');
          }
        })
      },
      // 分类名重复校验
      categoryNameExist(incomInfo){
        createCheck(incomInfo).then(res=>{
          if(res.statusCode==='000000'){
            if(res.list&&res.list.cname!=0){
              this.getMessageBox("该分类名称已存在，请重新输入",'warning');
              this.categoryVisible=false;
            }else{
              if(this.operateFlag==='modifiy'){
                this.modifiyConfirm(this.ruleForm);
              }else if(this.operateFlag==='add'){
                this.addCategoryConfirm(this.ruleForm);
              }
            }
          }else{
            this.getMessageBox("未知错误，请联系管理员",'error');
          }
        }).catch(err=>{
          this.getMessageBox(err,'error');
        })
      },
      // 表单校验
      handleFormVerify(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.categoryNameExist(this.ruleForm);
          } else {
            return false;
          }
        });
      },
      handleClose(){
          this.categoryVisible=false;
          for(let key in this.ruleForm){
            this.ruleForm[key]='';
          }
      },
      handlePageChange(val){
        this.pageSize=val.pageSize;
        this.currentPage=val.page;
        this.getCategoryList();
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
  .category-content{
    margin-top: 20px;
    .btn-content{
      margin-bottom: 30px;
      text-align: center;
    }
  }

</style>