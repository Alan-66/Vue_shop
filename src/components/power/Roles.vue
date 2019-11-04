<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home', name: '' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 角色列表 -->
    <el-card>
      <el-button type="primary">添加角色</el-button>

      <el-table :data="rolesList" border stripe>
        <!-- 展开行 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 渲染一级权限 -->
            <el-row
              v-for="(item1,index1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom',index1===0?'bdtop':'']"
            >
              <el-col :span="5">
                <el-tag>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2,index2) in item1.children"
                  :key="item2.id"
                  :class="[index2!==0?'bdtop':'']"
                >
                  <el-col :span="6">
                    <el-tag type="success">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeTag(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>

        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showRightsDialog"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog title="分配权限" :visible.sync="rightsDialogVisible" width="50%">
      <span slot="footer">
        <span>
          <el-tree
            :data="rightList"
            :props="treeProps"
            node-key="id"
            default-expand-all
            @node-click="handleNodeClick"
            :default-checked-keys="dfcKeys"
            show-checkbox
          ></el-tree>
        </span>
        <el-button @click=" rightsDialogVisible= false">取 消</el-button>
        <el-button type="primary" @click=" rightsDialogVisible= false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rolesList: [],
      rightList: [],
      treeProps: {
        //数据显示用label字段
        label: "authName",
        // 数据嵌套用children字段
        children: "children"
      },
      //默认选中的节点id数组
      dfcKeys: [105, 106],
      rightsDialogVisible: false
    };
  },
  methods: {
    //渲染角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      //console.log(res);
      if (res.meta.status != 200)
        return this.$message.error("获取角色列表失败");
      this.rolesList = res.data;
      //   console.log(this.rolesList);
    },
    // 移除三级标签
    async removeTag(role, rightsId) {
      const result = await this.$confirm("确认删除该项?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(err => console.log(err));
      if (result !== "confirm") {
        return this.$message.info("已取消操作");
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightsId}`
      );
      if (res.meta.status != 200) return this.$message.error("移除权限失败");
      role.children = res.data;
    },
    //显示分配权限对话框
    async showRightsDialog() {
      //获取权限列表数据
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status != 200)
        return this.$message.error("获取权限列表失败");
      this.rightList = res.data;
      this.rightsDialogVisible = true;
      //   console.log(res);
    },
    handleNodeClick() {}
  },
  created() {
    this.getRolesList();
  }
};
</script>
<style scoped lang="less">
.el-tag {
  margin: 7px;
}
.bdbottom {
  border-bottom: 1px solid #ccc;
}
.bdtop {
  border-top: 1px solid #ccc;
}
</style>