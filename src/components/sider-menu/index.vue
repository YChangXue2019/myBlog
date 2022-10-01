<template>
    <el-row>
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical-demo"
          :unique-opened="true"
          active-text-color="#409EFF"
          background-color="#545c64"
          text-color="#fff"
          @open="changeMenu"
          @select="changeMenu">
          <el-col v-for="item in siderMenuOptions" :key="item.id">
            <el-submenu  
                v-if="item.children&&item.children.length>0" 
                :index="item.name">
                <template slot="title">
                  <i :class="item.icon"></i>
                  <span>{{item.title}}</span>
                </template>
                <el-menu-item 
                    v-for="item2 in item.children" 
                    :key="item2.id" 
                    :index="item2.name"
                    style="padding-left:50px;">
                    <i :class="item2.icon"></i>
                    <span slot="title">{{item2.title}}</span>
                </el-menu-item>
            </el-submenu>
            <el-menu-item :index="item.name" v-else>
                <i :class="item.icon"></i>
                <span slot="title">{{item.title}}</span>
            </el-menu-item>
          </el-col>
        </el-menu>
    </el-row>
</template>

<script>
export default {
    name:'SiderMenu',
    props:{
        siderMenuOptions:{
            type:Array,
            default:[],
        }
    },
    computed:{
        activeMenu(){
            const route=this.$route;
            return route.name;
        }
    },
    methods:{
        // 切换菜单
        changeMenu(val){
            this.$emit('changeMenu',val)
        }
    }
}
</script>

<style lang="scss" scoped>
.el-menu-vertical-demo{
    position: fixed;
    left: 0;
    top: 0;
    width: 200px;
    height: 100%;
    padding-top: 60px;
    background: rgb(255, 255, 255);
}
</style>