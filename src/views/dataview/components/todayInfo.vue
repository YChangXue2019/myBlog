<template>
  <div class="today-info-content">
     <div class="info-item">
        <div class="info-icon icon-first">
            <span class="iconfont icon-edit"></span>
        </div>
        <div class="info-detail" >
            <div class="detail-num">{{dayInfo.reviewNum}}</div>
            <div class="detail-title">今日评论数量</div>
        </div>
     </div>
     <div class="info-item item-second">
        <div class="info-icon icon-second">
            <span class="iconfont icon-favorite"></span>
        </div>
        <div class="info-detail" >
            <div class="detail-num">{{dayInfo.collectNum}}</div>
            <div class="detail-title">今日收藏数量</div>
        </div>
     </div>
     <div class="info-item">
        <div class="info-icon icon-three">
            <span class="iconfont icon-good"></span>
        </div>
        <div class="info-detail" >
            <div class="detail-num">{{dayInfo.goodNum}}</div>
            <div class="detail-title">今日点赞数量</div>
        </div>
     </div>
  </div>
</template>

<script>
import {todayInfo} from '@/api/dataview'
export default {
    data(){
        return{
            dayInfo:{
                reviewNum:0,
                collectNum:0,
                goodNum:0,
            }
        }
    },
    created(){
        this.getTodayInfo();
    },
    methods:{
        getTodayInfo(){
            todayInfo().then(res=>{
                if(res.statusCode==='000000'){
                    this.dayInfo.reviewNum=res.list[0].rTotal;
                    this.dayInfo.collectNum=res.list[0].cTotal;
                    this.dayInfo.goodNum=res.list[0].uTotal;
                }
            }) 
        }
    }
}
</script>

<style lang="scss" scoped>
.today-info-content{
    flex: 1;
    display: flex;
    justify-content: space-between;
    width: 100%;
    box-sizing: border-box;
    .info-item{
        display: flex;
        flex: 1;
        box-shadow: 3px 3px 9px #ccc;
        .info-icon{
            width: 100px;
            height: 100px;
            line-height: 100px;
            // background: rgb(146, 161, 152);
            color: #fff;
            text-align: center;
            .iconfont{
                font-size: 30px;
            }
        }
        .icon-first{
            background: rgb(109, 186, 140);
        }
        .icon-second{
            background: rgb(100, 121, 174);
        }
        .icon-three{
            background: rgb(146, 161, 152);
        }
        .info-detail{
            flex: 1;
            display: flex;
            height: 100px;
            line-height: 35px;
            background:#fff;
            text-align: center;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            .detail-num{
                font-size: 25px;
                font-weight:normal;
            }
            .detail-title{
                font-size: 14px;
                color: rgb(158, 152, 152);
            }
        }
    }
    .item-second{
        margin: 0 20px;
    }
}
</style>