<template>
  <div class="data-view-content">
    <div class="view-left">
      <user-info/>
      <article-count/>
      <swiper/>
    </div>
    <div class="view-right">
      <TodayInfo></TodayInfo>
      <reset-view-pie/>
      <reset-view-lin/>
    </div>
  </div>
</template>

<script>
import UserInfo from './components/userInfo.vue'
import TodayInfo from './components/todayInfo.vue'
import ArticleCount from './components/articleCount.vue'
import ResetViewPie from './components/resetViewPie.vue'
import ResetViewLin from './components/resetViewLin.vue'
import Swiper from './components/swiper.vue'
export default {
  components:{
    UserInfo,
    TodayInfo,
    ArticleCount,
    ResetViewPie,
    ResetViewLin,
    Swiper,
  },
  data(){
      return{
      }
  },
  created(){

  },
  methods:{
  }
}
</script>

<style lang="scss" scoped>
.data-view-content{
  display: flex;
  .view-left{
    width:30%;
  }
  .view-right{
    margin-left: 20px;
    flex: 1;
  }
}
</style>