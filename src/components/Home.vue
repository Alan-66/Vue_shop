<template>
  <el-container class="home_container">
    <!-- Header content -->
    <el-header height>
      <div class="left">
        <img src="../assets/heima.png" alt="">
        <h3>电商后台管理系统</h3>
      </div>
      <el-button type="primary" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- Aside content -->
      <el-aside width="200px"></el-aside>
      <!-- Main content -->
      <el-main></el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
      this.$message({
        showClose: true,
        center: true,
        type: "error",
        message: "退出成功"
      });
    }
  }
};
</script>
<style scoped lang="less">
.home_container {
  height: 100%;
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-size: 20px;
    background-color: #373d41;
    .left {
      display: flex;
      align-items: center;
      h3{
        margin-left: 15px;
        font-weight: normal;
      }
    }
  }
  .el-aside {
    background-color: #333744;
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>