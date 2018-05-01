 <template>
    <div id="hw-article">
      <div class="page-boxtitle">
        <strong class="title">文章分类</strong>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/article' }">文章</el-breadcrumb-item>
          <el-breadcrumb-item>文章分类</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <el-tree :data="data" node-key="id" default-expand-all :expand-on-click-node="false">
        <el-row :gutter="20" slot-scope="{ node, data }">
          <el-col :span="12">{{ node.label }}</el-col>
          <el-col :span="4" style="text-algin:right;">1</el-col>
          <el-col :span="4" style="text-algin:center">
            <i class="iconfont icon-add" title="新增" @click="append(data)"></i>
            <i class="iconfont icon-delete" title="删除" @click="remove(node, data)"></i>
          </el-col>
        </el-row>

        <!-- <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span><i class="iconfont icon-add" title="新增" @click="append(data)"></i>
            <i class="iconfont icon-delete" title="删除" @click="remove(node, data)"></i>
          </span>
        </span> -->
      </el-tree>

    </div>
 </template>

<script>
let id = 1000;
const data = [{
  id: 1,
  label: '一级 1',
  deep: 0,
  children: [{
    id: 4,
    label: '二级 1-1',
    deep: 1,
    children: [{
      id: 9,
      label: '三级 1-1-1',
      deep: 2
    }, {
      id: 10,
      label: '三级 1-1-2',
      deep: 2
    }]
  }]
}, {
  id: 2,
  label: '一级 2',
  children: [{
    id: 5,
    label: '二级 2-1'
  }, {
    id: 6,
    label: '二级 2-2'
  }]
}, {
  id: 3,
  label: '一级 3',
  children: [{
    id: 7,
    label: '二级 3-1'
  }, {
    id: 8,
    label: '二级 3-2'
  }]
}];
  export default {
    data() {
      return {
        data: JSON.parse(JSON.stringify(data))
      }
    },

    methods: {
      append(data) {
        const newChild = { id: id++, label: 'testtest', children: [] };
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        data.children.push(newChild);
      },

      remove(node, data) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
      }  
    }
  }
</script>

<style lang="less" scoped>
.el-tree-node__content{
  height: 32px;
  padding: 10px;
}
.el-row{
  width: 100%; line-height: 32px;
}
.el-col{
  line-height: 32px;
}
.el-col-4{
  text-align: right;
}
</style>