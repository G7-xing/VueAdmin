<template>
  <div class="navbar">

    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">

      <el-dropdown class="avatar-container" trigger="click">
        <!-- <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div> -->
        <div>{{ nickname }}
          <i class="el-icon-caret-bottom"></i>
        </div>

        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item @click.native="changePWD">
            <span>修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="25%" :before-close="close" modal center :close-on-press-escape="false">
      <el-form :model="userForm" status-icon :rules="rules" ref="userForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input type="Password" v-model="userForm.oldPassword" autocomplete="off" style="width: 250px;"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="Password" v-model="userForm.newPassword" autocomplete="off" style="width: 250px;"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="userForm.confirmPassword" type="Password" style="width: 250px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitEvent()">提交</el-button>
          <el-button @click="resetForm('userForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- <vxe-modal title="修改密码" v-model="dialogFormVisible" resize destroy-on-close style="font-size: large;">
      <template #default>
        <vxe-form :data="user" title-align="right" title-width="100" @submit="submitEvent" :rules="rules" ref="userForm">
          <vxe-form-item field="oldPassword" title="旧密码:" :item-render="{}">
            <template #default="{ data }">
              <vxe-input v-model="data.oldPassword" type="password" placeholder="请输入旧密码"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item field="newPassword" title="新密码:" :item-render="{}">
            <template #default="{ data }">
              <vxe-input v-model="data.newPassword" type="password" placeholder="请输入新密码"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item field="confirmPassword" title="确认密码:" :item-render="{}">
            <template #default="{ data }">
              <vxe-input v-model="data.confirmPassword" type="password" placeholder="请确认新密码"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item align="center" title-align="left" :span="24">
            <template #default>
              <vxe-button type="submit" status="success">提交</vxe-button>
              <vxe-button type="reset">重置</vxe-button>
            </template>
          </vxe-form-item>
        </vxe-form>
      </template>
    </vxe-modal> -->

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { checkOldPassword, updateUserPwd } from '@/api/user'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'nickname',
      'userid'
    ])
  },
  data() {
    // const equalToPassword = (itemValue) => {
    //   if (this.user.newPassword !== itemValue) {
    //     debugger
    //     return new Error("两次输入的密码不一致");
    //   }
    // };
    const validaPass =  (rule, value, callback) => {
      checkOldPassword({ id: this.userid, password: value }).then(res => {
        if (!res.success) {
          //debugger
          return callback(new Error(res.msg));
        }else{
          callback();
        }
      })
    };
    var equalToPassword = (rule, value, callback) => {
      console.log(this.userForm);
     if (value !== this.userForm.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      dialogFormVisible: false,
      test: "1test",
      userForm: {
        oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined
      },
      // 表单校验
      rules: {
        oldPassword: [
          { required: true, message: "旧密码不能为空", trigger: 'blur' },
          {
            validator: validaPass, trigger: "blur"
          }
        ],
        newPassword: [
          { required: true, message: "新密码不能为空", trigger: 'blur' },
          { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: "确认密码不能为空", trigger: 'blur' },
          {
            validator: equalToPassword, trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    //#region  一下是修改密码的methods
    changePWD() {
      this.dialogFormVisible = true;
    },
    submitEvent() {
      this.$refs["userForm"].validate(valid => {
        if (valid) {
          updateUserPwd({ id: this.userid, password: this.userForm.newPassword }).then(
            res => {
              if (res.success) {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                });
                this.logout();
              } else {
                this.$message({
                  message: res.msg,
                  type: 'error'
                });
              }
            }
          );
        }
      });
    },
    close() {
      this.resetForm('userForm');
      this.dialogFormVisible=false;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
    //#endregion  
  }
}
</script>

<style lang="scss" scoped>
.zinfr {
  z-index: unset 50000 !important;
}

.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
