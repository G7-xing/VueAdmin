<template>
    <div class="site-wrapper site-page--login">
        <div class="site-content__wrapper">
            <div class="site-content">
                <div class="brand-info">
                    <h2 class="brand-info__text">Veoneer Production IT System</h2>
                    <p class="brand-info__intro">目前支持EWI在线预览模块</p>
                </div>
                <div class="login-main">
                    <el-form ref="loginForm" :model="loginForm" class="login-form" auto-complete="on" label-position="left">
                        <div class="title-container">
                            <h1 class="title">Login System</h1>
                        </div>
                        <el-form-item prop="UserName">
                            <span class="svg-container">
                                <svg-icon icon-class="user" />
                            </span>
                            <el-input ref="UserName" v-model="loginForm.UserName" placeholder="UserName" name="UserName"
                                type="text" tabindex="1" auto-complete="on" />
                        </el-form-item>
                        <el-form-item prop="Password">
                            <span class="svg-container">
                                <svg-icon icon-class="password" />
                            </span>
                            <el-input :key="passwordType" ref="Password" v-model="loginForm.Password" :type="passwordType"
                                placeholder="Password" name="Password" tabindex="2" auto-complete="on"
                                @keyup.enter.native="handleLogin" />
                            <span class="show-pwd" @click="showPwd">
                                <svg-icon :icon-class="passwordType === 'Password' ? 'eye' : 'eye-open'" />
                            </span>
                        </el-form-item>

                        <el-button :loading="loading" type="primary" style="width: 100%; margin-bottom: 30px"
                            @click.native.prevent="handleLogin">Login</el-button>
                    </el-form>
                    <div style="text-align: center; margin-top: 50px;color: darkcyan;">版权所有 2022 Veoneer Production IT MES Team</div>
                </div>
            </div>

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
                        .catch(() => {
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

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-main .el-input input {
        color: $cursor;
    }
}

/* reset element-ui css */
.login-main {
    .el-input {
        display: inline-block;
        height: 47px;
        width: 85%;

        input {
            background: transparent;
            border: 0px;

            border-radius: 0px;
            padding: 12px 5px 12px 15px;
            color: $light_gray;
            height: 47px;
            caret-color: $cursor;

            &:-webkit-autofill {
                box-shadow: 0 0 0px 1000px $bg inset !important;
                -webkit-text-fill-color: $cursor !important;
            }
        }
    }

    .el-form-item {
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #454545;
    }
}
</style>
<style lang="scss">
.site-wrapper.site-page--login {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(38, 50, 56, .6);
    overflow: hidden;

    &:before {
        position: fixed;
        top: 0;
        left: 0;
        z-index: -1;
        width: 76%;
        height: 100%;
        content: "";
        background-image: url(~@/assets/login_bg.jpg);
        background-size: cover;
    }

    .site-content__wrapper {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        padding: 0;
        margin: 0;
        overflow-x: hidden;
        overflow-y: auto;
        background-color: transparent;
    }

    .site-content {
        min-height: 100%;
        padding: 20px 500px 30px 30px;
    }

    .brand-info {
        margin: 77px 108px 0px 70px;
        color: #fff;
    }

    .brand-info__text {
        margin: 0 0 22px 0;
        font-size: 68px;
        font-weight: 420;
        text-transform: uppercase;
    }

    .brand-info__intro {
        margin: 10px 0;
        font-size: 32px;
        line-height: 1.58;
        opacity: .6;
    }

    .login-main {
        position: fixed;
        top: 0;
        right: 0;
        padding: 120px 0px 150px;
        width: 470px;
        min-height: 100%;
        background-color: #26384d;
    }

}

</style>
<style lang="scss" scoped>$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-main {
    .login-form {
        position: relative;
        width: 520px;
        max-width: 100%;
        padding: 160px 35px 0;
        margin: 0 auto;
        overflow: hidden;
    }

    .tips {
        font-size: 14px;
        color: #fff;
        margin-bottom: 10px;

        span {
            &:first-of-type {
                margin-right: 16px;
            }
        }
    }

    .svg-container {
        padding: 6px 5px 6px 15px;
        color: $dark_gray;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
    }

    .title-container {
        position: relative;

        .title {
            font-size: 26px;
            color: $light_gray;
            margin: 0px auto 40px auto;
            text-align: center;
            font-weight: bold;
        }
    }

    .show-pwd {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
        user-select: none;
    }

}
</style>
