<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>
      <el-form
        label-width="0px"
        class="login_form"
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
      >
        <!-- 用户名呢 -->
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-3702mima"
            v-model="loginForm.password"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>



<script>
import { async } from "q";
export default {
  name: "login",
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456"
      },

      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "用户名长度在3到16字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 16, message: "密码长度在6到16字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //重置表单
    resetLoginForm() {
      //   console.log(this);
      this.$refs.loginFormRef.resetFields();
    },
    //登录功能
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        //如果失败就结束 成功就继续放发ajax
        if (!valid) return;
        const { data: res } = await this.$http.post("login", this.loginForm);
        if (res.meta.status != 200)
          return this.$message({
            showClose: true,
            message: "登录失败！",
            center: true,
            type: "error"
          });
        this.$message({
          showClose: true,
          message: "登录成功！",
          center: true,
          type: "success"
        });
        window.sessionStorage.setItem("token", res.data.token);
        this.$router.push("/home");
      });
    }
  }
};
</script>



<style scoped lang="less">
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .avatar_box {
      height: 130px;
      width: 130px;
      border-radius: 50%;
      padding: 10px;
      border: 1px solid #eee;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      top: 0;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
}
.login_form {
  width: 100%;
  box-sizing: border-box;
  position: absolute;
  left: 0;
  bottom: 0;
  padding: 0 20px;
  .btns {
    display: flex;
    justify-content: flex-end;
  }
}
</style>