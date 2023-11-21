<template>
    <div class="rr-login back-img">
      <div class="rr-login-wrap">
        <div class="rr-login-left hidden-sm-and-down">
            <p class="rr-login-left-title">Veoneer Production IT MES System</p>
        </div>
  
        <div class="rr-login-right">
          <div class="rr-login-right-main">
            <h4 class="rr-login-right-main-title">Login System</h4>
            <el-form ref="loginForm" label-width="80px" :status-icon="true" :model="loginForm"  @keyup.enter="handleLogin">
              <el-form-item label-width="0" prop="username">
                <el-input v-model="loginForm.UserName" placeholder="用户名" prefix-icon="el-icon-user" autocomplete="on"></el-input>
              </el-form-item>
              <el-form-item label-width="0" prop="password">
                <el-input placeholder="密码" v-model="loginForm.Password" prefix-icon="el-icon-lock" autocomplete="on" show-password></el-input>
              </el-form-item>
              <el-form-item label-width="0">
                <el-button type="primary" size="small" :disabled="loading" @click="handleLogin" round class="rr-login-right-main-btn"> Login </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="login-footer">
        <p>Production IT | 2023-2024©Tianxing.Song Dev</p>

      </div>
    </div>
  </template>

<script>
import {
    validUsername
} from "@/utils/validate";

export default {
    name: "Login",
    data() {
        const validateUsername = (rule, value, callback) => {
            if (!validUsername(value)) {
                callback(new Error("Please enter the correct user name"));
            } else {
                callback();
            }
        };
        const validatePassword = (rule, value, callback) => {
            if (value.length < 4) {
                callback(new Error("The Password can not be less than 6 digits"));
            } else {
                callback();
            }
        };
        return {
            loginForm: {
                UserName: "",
                Password: "",
            },
            loginRules: {
                UserName: [{
                    required: true,
                    trigger: "blur",
                    validator: validateUsername
                },],
                Password: [{
                    required: true,
                    trigger: "blur",
                    validator: validatePassword
                },],
            },
            loading: false,
            passwordType: "Password",
            redirect: undefined,
            otherQuery: {}
        };
    },
    watch: {
        $route: {
            handler: function (route) {
                const query = route.query
                if (query) {
                    this.redirect = query.redirect
                    this.otherQuery = this.getOtherQuery(query)
                }
            },
            immediate: true
        }
    },
    methods: {
        showPwd() {
            if (this.passwordType === "Password") {
                this.passwordType = "";
            } else {
                this.passwordType = "Password";
            }
            this.$nextTick(() => {
                this.$refs.Password.focus();
            });
        },
        handleLogin() {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.loading = true;
                    this.$store
                        .dispatch("user/login", this.loginForm)
                        .then(() => {
                            this.$router.push({
                                path: "/",
                                query: this.otherQuery
                            });
                            this.loading = false;
                        })
                        .catch((err) => {
                            this.$message
                                .error(err || "登录失败，请重试")
                            this.loading = false;
                        });
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        getOtherQuery(query) {
            return Object.keys(query).reduce((acc, cur) => {
                if (cur !== 'redirect') {
                    acc[cur] = query[cur]
                }
                return acc
            }, {})
        }
    },
};
</script>

<style lang="less" scoped>
@import url("@/assets/theme/base.less");
.back-img{
  background-image: url("~@/assets/login_bg.jpg");
  background-size: cover;
  background-position: center center;
}
.rr-login {
  width: 100vw;
  height: 100vh;
 
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 992px) {
    .rr-login-wrap {
      width: 96% !important;
    }
    .rr-login-right {
      width: 100% !important;
    }
  }

  &-wrap {
    margin: -150px 0px 0px 0px;
    width: 1000px;
    box-shadow: -4px 5px 10px rgba(0, 0, 0, 0.4);
    animation-duration: 1s;
    animation-fill-mode: both;
    border-radius: 85px;
    overflow: hidden;
  }

  &-left {
    justify-content: center;
    flex-direction: column;
    
    color: #fff;
    float: left;
    width: 50%;

    &-title {
      margin:  4.5em -5em 0em 0em;
      width: 65%;
      justify-content: center;
      text-align: center;
      color: rgb(0, 255, 255);
      font-weight: 500;
      letter-spacing: 2px;
      font-size: 1.56em;
    }
  }

  &-right {
    border-left: none;
    color: #fff;
    background:linear-gradient(to bottom right, #40567f, #111c30);
    width: 50%;
    float: left;

    &-main {
      margin: 0 auto;
      width: 65%;
      &-title {
        color: rgb(0, 255, 255);;
        margin-bottom: 40px;
        font-weight: 500;
        font-size: 24px;
        text-align: center;
        letter-spacing: 4px;
      }

      &-lang .iconfont {
        font-size: 20px;
        color: #606266;
        font-weight: 800;
        width: 20px;
        height: 20px;
      }

      .el-input__inner {
        border-width: 0;
        border-radius: 0;
        border-bottom: 1px solid #e6dcdd;
    
      }

      &-code {
        width: 100%;
        .el-space__item:first-child {
          flex: 1;
        }
      }
      &-btn {
        width: 100%;
        height: 45px;
        font-size: 22px !important;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-weight: 800;
        letter-spacing: 2px;
        font-weight: 300 !important;
        color: #000;
        cursor: pointer;
        margin-top: 30px;
        font-family: neo, sans-serif;
        transition: 0.25s;
        background-color: rgb(0, 255, 255);;
      }
    }
  }

  .login-footer {
    text-align: center;
    position: absolute;
    bottom: 0;
    padding: 20px;
    color: rgba(255, 255, 255, 0.6);
    p {
      margin: 10px 0;
    }
    a {
      padding: 0 5px;
      color: rgba(255, 255, 255, 0.6);
      &:focus,
      &:hover {
        color: #fff;
      }
    }
  }

  &-left,
  &-right {
    position: relative;
    min-height: 100px;
    align-items: center;
    display: flex;
  }

  @keyframes animate-down {
    0%,
    60%,
    75%,
    90%,
    to {
      animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    }
    0% {
      opacity: 0;
      transform: translate3d(0, -3000px, 0);
    }
    60% {
      opacity: 1;
      transform: translate3d(0, 25px, 0);
    }
    75% {
      transform: translate3d(0, -10px, 0);
    }
    90% {
      transform: translate3d(0, 5px, 0);
    }
    to {
      transform: none;
    }
  }

  .animate-down {
    animation-name: animate-down;
  }
}
</style>