<template>
  <div>
    <el-table
      v-bind="$attrs"
      v-on="$listeners"
      ref="multipleTable"
      style="width: 100%"
      header-row-class-name="containers-table-header-row-class-name"
      header-cell-class-name="containers-table-header-cell-class-name"
      cell-class-name="containers-table-cell-class-name"
      default-expand-all
      @click='getTableRef()'
    >
      <el-table-column v-if="serial" label="序号" type="index" width="50"> </el-table-column>
      <template v-for="(item, index) in columns">
        <el-table-column
          v-if="item['slotName']"
          :key="index"
          v-bind="item.bind"
        >
          <template slot-scope="scope">
            <slot :name="item.slotName" v-bind="scope" />
          </template>
        </el-table-column>
        <el-table-column v-else :key="index" v-bind="item.bind">
        </el-table-column>
      </template>
      <template slot="empty">
        <el-empty description="暂无数据"></el-empty>
      </template>
    </el-table>
    <div class="table-botton">
      <div>
        <slot name="bottonLeft"></slot>
      </div>
      <el-pagination
        v-if="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :pager-count="5"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    //表格列的配置描述
    columns: {
      type: Array,
      default() {
        return []
      },
    },
    // 总条数
    total: {
      type: Number,
      default: 0,
    },
    // 是否展示分页
    pagination: {
      type: Boolean,
      default: false,
    },
    // 是否展示序号
    serial:{
      type:Boolean,
      default:false,
    },
  },
  data() {
    return {
      page: 1,
      pageSize: 5,
    }
  },
  methods: {
    // 重置分页
    reset(){
      this.page= 1;
      this.pageSize= 5;
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      // 每页数量发生改变时回调
      this.$emit("pageChange",{pageSize,page:this.page})
    },
    handleCurrentChange(page) {
      this.page = page
      // 页码发生改变时回调
       this.$emit("pageChange",{pageSize:this.pageSize,page})
    },
    getTableRef(){
      return this.$refs.multipleTable;
    }
  },
}
</script>

<style lang="scss" scoped>
.table-botton {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 15px;
}
</style>
<style lang="scss">
@import './table.scss';
</style>