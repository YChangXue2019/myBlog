<template>
  <div class="echart-view-content">
    <div 
        class="echart"
        id="myEchart">
    </div>
  </div>
</template>

<script>
import {categoryInfo} from '@/api/dataview'
import * as echarts from 'echarts';
export default {
    data(){
        return{

        }
    },
    mounted(){
        this.getCategoryInfo();
    },
    methods:{
      getCategoryInfo(){
        categoryInfo().then(res=>{
          if(res.statusCode==='000000'){
            this.initEchart(res.list[0]);
          }
        }).catch(err=>{

        })
      },
      initEchart(list){
        const chartDom = document.getElementById('myEchart');
        const myChart = echarts.init(chartDom);
        const option = {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            left: 'left'
          },
          series: [
            {
              type: 'pie',
              radius:['40%','70%'],
              emphasis: {
                    itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
              data:[
                {value:list.bTotal,name:'文章数量'},
                {value:list.rTotal,name:'评论数量'},
                {value:list.cTotal,name:'收藏数量'},
                {value:list.uTotal,name:'点赞数量'},
              ],
              label: {
                normal: {
                    show: true,
                    position: 'outside',
                }
              },
              labelLine: {
                normal: {
                    show: true,
                    length:10,
                    length2:20,
                }
              },
            }
          ]
        };
        option && myChart.setOption(option);
      }
    }
    
}
</script>

<style lang="scss" scoped> 
.echart-view-content{
    margin-top: 20px;
    padding: 20px;
    box-sizing: border-box;
    box-shadow: 3px 3px 9px #ccc;
    background: #fff;
    .echart{
        width: 100%;
        height:350px;
    }
}

</style>