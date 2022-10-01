<template>
  <div class="reset-view-line">
    <div 
        id="main"
        class="main-echart-info">

    </div>
  </div>
</template>

<script>
import moment from 'moment';
import {articleSevenInfo} from '@/api/dataview'
import * as echarts from 'echarts';
export default {
    data(){
        return{

        }
    },
    mounted(){
      this.getArticleSevenInfo();
      // this.innitData();
    },
    methods:{
      // 获取文章七日数据
      getArticleSevenInfo(){
        articleSevenInfo().then(res=>{
          if(res.statusCode==='000000'){
            this.innitData(res)
          }
        })
      },
      // 处理数据
      handleEchartInfo(list){
        let articleInfo=[];
        let reviewInfo=[];
        let collectInfo=[];
        let likeInfo=[];
        let dateInfo=list.dateList;
        list.aList.forEach(item => {
          articleInfo.push(item.total); 
        });
        list.rList.forEach(item => {
          reviewInfo.push(item.total); 
        });
        list.cList.forEach(item => {
          collectInfo.push(item.total); 
        });
        list.uList.forEach(item => {
          likeInfo.push(item.total); 
        });
        return {
          dateInfo,
          articleInfo,
          reviewInfo,
          collectInfo,
          likeInfo,
        }
      },
      // 初始化echart
      innitData(list){
        const {dateInfo,articleInfo,reviewInfo,collectInfo,likeInfo}=this.handleEchartInfo(list);
        const chartDom = document.getElementById('main');
        const myChart = echarts.init(chartDom);
        const option = {
          title: {
            text: '近七日数据走势图'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['文章数量','访问数量', '评论数量', '收藏数量', '点赞数量']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: dateInfo,
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '文章数量',
              type: 'line',
              data:articleInfo,
            },
            {
              name: '评论数量',
              type: 'line',
              data: reviewInfo,
            },
            {
              name: '收藏数量',
              type: 'line',
              data: collectInfo,
            },
            {
              name: '点赞数量',
              type: 'line',
              data: likeInfo,
            }
          ]
        };
        option && myChart.setOption(option);
      }
    }
}
</script>

<style lang="scss" scoped>
    .reset-view-line{
        margin-top: 20px;
        padding: 20px;
        box-sizing: border-box;
        box-shadow: 3px 3px 9px #ccc;
        background: #fff;
        .main-echart-info{
            width: 100%;
            height: 400px;
        }
    }

</style>