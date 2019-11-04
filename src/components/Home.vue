<template>
  <el-container class="home_container">
    <!-- Header content -->
    <el-header height>
      <div class="left">
        <img src="../assets/heima.png" alt />
        <h3>电商后台管理系统</h3>
      </div>
      <el-button type="primary" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- Aside content -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <!-- 折叠菜单按钮 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <el-submenu :index="item.id+''" v-for="item in list" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item
              :index="'/'+subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/'+subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- Main content -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      list: [],
      isCollapse: false,
      iconsObj: {
        125: "iconfont icon-users",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao"
      },
      activePath: ""
    };
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
    },
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status != 200) return this.$message.error("获取列表失败");
      this.list = res.data;
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    saveNavState(val) {
      window.sessionStorage.setItem('activePath',val)
      this.activePath =val
    }

  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
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
      h3 {
        margin-left: 15px;
        font-weight: normal;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    .el-menu {
      border-right: none;
    }
    .toggle-button {
      line-height: 24px;
      background-color: #4a5064;
      text-align: center;
      color: #fff;
      letter-spacing: 0.2em;
      font-size: 10px;
      cursor: pointer;
    }
    .iconfont {
      margin-right: 15px;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>