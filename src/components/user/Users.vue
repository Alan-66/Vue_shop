<template>
  <div>
    <!-- 用户列表页面 -->
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home', name: '' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 栅格 -->
      <!-- 搜索 添加区域 -->
      <el-row :gutter="15">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>

        <el-table-column label="状态" prop="mg_state">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180px">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUser(scope.row.id)"
            ></el-button>
            <!-- 提示标签 -->
            <el-tooltip content="分配角色" placement="top" effect="dark" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 8]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>

      <!-- 添加用户的对话框 -->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addFormClosed">
        <!-- 内容主题区域 -->
        <el-form :model="addForm" ref="addFormRef" :rules="addFormRules" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer">
          <el-button @click="addDialogVisible=false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户的对话框 -->
      <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editFormClosed">
        <el-form :model="editForm" ref="editFormRef" label-width="80px" :rules="editFormRules">
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="editDialogVisible= false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import { async } from "q";
export default {
  created() {
    this.getUserList();
  },
  data() {
    //验证邮箱合法的规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (regEmail.test(value)) {
        return callback();
      }
      callback(new Error("请输入正确的邮箱地址"));
    };
    //验证手机号码的规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
      if (regMobile.test(value)) {
        return callback();
      }
      callback(new Error("请输入正确的手机号码"));
    };

    return {
      //获取用户列表的数据
      queryInfo: {
        query: "",
        pagesize: 2, //当前页数据总条数
        pagenum: 1 //当前页码
      },
      userList: [],
      total: 0,
      //控制添加用户的显示与隐藏
      addDialogVisible: false,
      //控制修改用户的显示与隐藏
      editDialogVisible: false,
      //添加用户的表单数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      //添加用户的验证规则
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名长度在3~10字符之间",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "密码长度在6~16字符之间",
            trigger: "blur"
          }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      //修改用户查询到的对象
      editForm: {}
    };
  },
  //get delete this.$http.get('users'{params:数据对象})
  //post put this.$http.get('users'{数据})

  methods: {
    //获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      if (res.meta.status != 200)
        return this.$message.error("获取用户列表失败！");
      //   console.log(res);
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    sizeChange(newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    currentChange(newPage) {
      // console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    //用户状态改变
    async userStateChange(userInfo) {
      // console.log(userInfo);
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      if (res.meta.status != 200) {
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error("修改用户状态失败！");
      }
      this.$message.success("修改用户状态成功！");
    },
    //添加用户对话框关闭重置
    addFormClosed() {
      this.$refs.addFormRef.resetFields();
    },
    //添加用户请求
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("users", this.addForm);
        if (res.meta.status != 201) {
          this.$message.error("添加用户失败！");
        } else {
          this.$message.success("添加用户成功！");
          this.addDialogVisible = false;
          this.getUserList();
        }
      });
    },
    // 显示用户修改对话框
    async showEditDialog(id) {
      // console.log(id);
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status != 200) {
        this.$message.error("获取用户信息失败");
      } else {
        this.editForm = res.data;
        // console.log(this.editForm);
      }

      this.editDialogVisible = true;
    },
    //用户修改重置
    editFormClosed() {
      this.$refs.editFormRef.resetFields();
    },
    //修改用户请求
    editUserInfo() {
      //进行表单的预验证
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "users/" + this.editForm.id,
          { email: this.editForm.email, mobile: this.editForm.mobile }
        );
        if (res.meta.status != 200) {
          this.$message.error("修改用户失败");
        } else {
          //隐藏修改用户对话框
          this.editDialogVisible = false;
          //更新数据列表
          this.getUserList();
          //显示成功信息
          this.$message.success("修改用户信息成功");
        }
      });
    },
    // 删除用户功能
    async deleteUser(id) {
      const result = await this.$confirm("是否确认删除该用户", "确认信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(err => console.log(err));
      console.log(res);
      if (result != "confirm") {
        return this.$message.info("已取消操作");
      }
      const { data: res } = await this.$http.delete("users/" + id);
      if (res.meta.status != 200) return this.$message.error("删除用户失败");
      this.$message.success("删除用户成功");
      this.queryInfo.pagenum = 1;
      this.getUserList();
    }
  }
};
</script>
<style scoped lang="less">
</style>