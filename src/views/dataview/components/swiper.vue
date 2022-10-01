<template>
  <div class="swiper-content">
    <el-carousel indicator-position="inside" height="250px">
        <el-carousel-item v-for="item in swiperInfo" :key="item.id">
          <img :src="item.bannerUrl" alt="" class="swiper-img">
        </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import {swiperList} from '@/api/dataview'
export default {
    data(){
        return {
            swiperInfo:[],
        }
    },
    created(){
        this.getSwiperList();
    },
    methods:{
        getSwiperList(){
            swiperList().then(res=>{
                if(res.statusCode==='000000'){
                    this.swiperInfo=res.list||[];
                }
            }).catch(err=>{

            })
        }
    }
}
</script>

<style lang="scss" scoped>
.swiper-content{
    width: 100%;
    // height: 300px;
    margin-top: 20px;
    padding: 2px;
    box-sizing: border-box;
    box-shadow: 3px 3px 9px #ccc;
    background: #fff;
    .swiper-img{
        width: 100%;
        height: 100%;
    }
}
</style>