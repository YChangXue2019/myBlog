<template>
  <div class="article-count-content">
    <ui-table 
        :data="infoList" 
        :columns="columns"
        :pagination="false"
        :serial="false">
      </ui-table>
  </div>
</template>

<script>
import {articleInfo} from '@/api/dataview'
import UiTable from "@/components/ui-table"
export default {
    components:{
        UiTable
    },
    data(){
        return{
            infoList:[],
            columns:[
                {
                  bind:{
                    prop:"cname",
                    label:"文章类别",
                    width:130,
                  },
                },
                {
                  bind:{
                    prop:"dTotal",
                    label:"今日数量",
                  }
                },
                {
                  bind:{
                    prop:'mTotal',
                    label:"本月数量",
                  },
                },{
                  bind:{
                    prop:'aTotal',
                    label:"总数量",
                  },
                }
            ],
        }
    },
    created(){
      this.getArticleInfo();
    },
    methods:{
      getArticleInfo(){
        articleInfo().then(res=>{
          if(res.statusCode==='000000'){
            this.infoList=res.list||[];
          }
        })
      }
    }

}
</script>

<style lang="scss" scoped>
.article-count-content{
    margin-top: 20px;
    box-sizing: border-box;
    box-shadow: 3px 3px 9px #ccc;
} 

</style>