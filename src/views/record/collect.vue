<template>
  <div class="collect-content">
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
          <el-form-item label="收藏文章">
            <el-input v-model="ruleForm.title" placeholder="请输入文章标题"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :getter="40">
        <el-col :span="11">
          <el-form-item label="收藏人名称">
            <el-input v-model="ruleForm.cauthor" placeholder="请输入用户名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="收藏日期">
            <el-date-picker
              v-model="ruleForm.ctime"
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
          <el-button type="primary" @click="getCollectList">查询</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div>
      <ui-table 
        :data="collectInfo" 
        :columns="columns"
        :total="total"
        :pagination="true"
        :serial="false"
        @pageChange="handlePageChange">
        <template v-slot:ctime="{row}">
          <div>{{row.ctime&&handleFormateDate(row.ctime)}}</div>
        </template>
        <template v-slot:operate="{row}">
          <el-button type="text" @click="remove(row)">删除</el-button>
        </template>
      </ui-table>
    </div>
  </div>
</template>

<script>
import UiTable from '@/components/ui-table'
import moment from 'moment';
import{collectList,deleteCollect} from '@/api/collect'
import{categoryOption} from '@/api/category'
export default {
    components:{
        UiTable,
    },
    data(){
        return{
            collectInfo:[],
            currentPage:1,
            pageSize:5,
            total:0,
            articleTypeOptions:[],
            ruleForm:{
              cid:'',
              title:'',
              cauthor:'',
              ctime:[],
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
                    label:"收藏文章",
                  },
                },
                {
                  bind:{
                    prop:"cauthor",
                    label:"收藏人名称",
                  }
                },{
                  bind:{
                    prop:"ctime",
                    label:"收藏日期",
                  },
                  slotName:'ctime'
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
        this.getCollectList();
        this.getCategoryOptions();
    },
    methods:{
        // 文章类别查询
        getCategoryOptions(){
            categoryOption().then(res=>{
              if(res.statusCode==='000000'){
                this.articleTypeOptions=res.list||[];
              }
            })
        },
        //重置
        handleReset(){
            for(let key in this.ruleForm){
              this.ruleForm[key]='';
            }
        },
        // 查询
        getCollectList(){
            collectList({
                currentPage:this.currentPage,
                pageSize:this.pageSize,
                cid:this.ruleForm.cid,
                title:this.ruleForm.title,
                cauthor:this.ruleForm.cauthor,
                sTime:this.ruleForm.ctime[0]||'',
                eTime:this.ruleForm.ctime[1]||'',
            }).then(res=>{
                if(res.statusCode==='000000'){
                    this.total=res.total;
                    this.collectInfo=res.list||[];
                }
            }).catch(err=>{

            })
        },
        // 分页处理
        handlePageChange(val){
            this.pageSize=val.pageSize;
            this.currentPage=val.page;
            this.getCollectList();
        },
        // 删除
        remove(row){
            this.$confirm('您确认要删除该条数据？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type:'warning'
            }).then(res=>{
                this.removeConfrim(row)
            })
        },
        // 确认删除
        removeConfrim(row){
            deleteCollect({id:row.id}).then(res=>{
                if(res.statusCode==='000000'){
                    this.getMessageBox('删除成功','success');
                    this.getCollectList();
                }
            }).catch(err=>{
                this.getMessageBox('删除失败','error');
            })
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
.collect-content{
    .btn-content{
      margin-bottom: 30px;
      text-align: center;
    }
}
</style>