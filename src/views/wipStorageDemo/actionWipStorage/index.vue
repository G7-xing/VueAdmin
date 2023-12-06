<template>
    <div>
        <!-- 绑定界面 -->
        <van-tabs v-show="active === 0" sticky @click="bangdingOnclick" v-model="bangdingActive">
            <van-tab title="小车与Magazine" name="00">
                <el-card :body-style="{ padding: '5px' }" shadow="always">
                    <van-field  v-model="bangdingCarNo0" ref="bangdingCarNo0" center clearable label-align="right"
                        label="小车(Car):" :disabled="checkBangdingMagazineFlag" placeholder="请扫入小车二维码信息" 
                        @keydown.enter.native="checkbangdingCarNo0()" label-width="4.5rem">
                    </van-field>
                    <van-field  v-model="bangdingMagazine0" ref="bangdingMagazine0" v-show="checkBangdingMagazineFlag" center
                        clearable label-align="right" label="Magazine:" placeholder="请扫入Magazine二维码信息" label-width="4.5rem"
                        @keydown.enter.native="checkBangdingMagazine0()" >
                    </van-field>
                </el-card>
                <div v-show="checkBangdingMagazineFlag">
                    <DemoBlock>Magazine绑定列表</DemoBlock>
                    <el-card>
                        <el-table :data="tableMagazineData" style="width: 100%" size="mini"
                            :header-cell-style="{ color: '#07c160', 'font-size': 'initial' }"
                            :cell-style="{ 'font-size': 'initial', 'line-height': '2px' }" border>
                            <el-table-column label="Magazine编号" align="center">
                                <template slot-scope="scope">
                                    <div slot="reference">
                                        <el-tag size="medium">{{ scope.row.magazineNo }}</el-tag>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" align="center">
                                <template slot-scope="scope">
                                    <el-button size="mini" type="danger" v-if="scope.row.type === 'new'"
                                        @click="handleMagazineDelete(scope.$index, scope.row)">删除</el-button>
                                    <el-tag v-else-if="scope.row.type === 'old'" type="info">已绑定该车</el-tag>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-card>
                    <div class="button-group">
                        <van-button icon="records" type="primary" @click="handleBangdingMagazineData()">提交</van-button>
                        <van-button icon="replay" @click="bangdingMagazineReplay()" type="warning">重置</van-button>
                    </div>
                </div>
            </van-tab>
            <van-tab title="小车与库位" name="01">
                <el-card :body-style="{ padding: '5px' }" shadow="always">
                    <van-field v-model="bangdingLocation0" ref="bangdingLocation0" center clearable label-align="right"
                        label="库位(Location):" :disabled="checkBangdingLocationFlag" placeholder="请扫入库位二维码信息"
                        inputmode="none" @keydown.enter.native="checkBangdingLoction0()" label-width="7.5rem">
                    </van-field>
                    <van-field v-model="bangdingFullMagazineCarNo0" ref="bangdingFullMagazineCarNo0"
                        v-show="checkBangdingLocationFlag" center clearable :disabled="checkAllPassBangdingLocationFlag"
                        label-align="right" label="小车(Car):" placeholder="请扫入小车二维码信息" label-width="7.5rem"
                        @keydown.enter.native="checkBangdingFullMagazineCarNo0()" inputmode="none">
                    </van-field>
                </el-card>
                <div class="button-group" v-show="checkAllPassBangdingLocationFlag">
                    <van-button icon="records" type="primary" @click="handleBangdingLocationData()">提交</van-button>
                    <van-button icon="replay" @click="bangdingLocationReplay()" type="warning">重置</van-button>
                </div>
            </van-tab>
        </van-tabs>
        <!-- 解绑界面 -->
        <div v-show="active===1">
            <DemoBlock>小车与库位解绑</DemoBlock>
            <UnbindActionPDA :active="active" :userid="userid"></UnbindActionPDA>
        </div>
        
        <!-- 查询界面 -->
        <!-- 底部导航 -->
        <van-tabbar v-model="active">
            <van-tabbar-item icon="checked">绑定</van-tabbar-item>
            <van-tabbar-item icon="clear">解绑</van-tabbar-item>
            <van-tabbar-item icon="search">查询</van-tabbar-item>
        </van-tabbar>

    </div>
</template>

<script>
import DemoBlock from '@/components/DemoBlock';

import { Notify, Dialog } from 'vant';
import { checkCarIsFullByCarNo, checkMagazineIsValidByNo, saveCarWithMagazineInfo, checkLoctionIsValidByNo, checkFullMagazineCarIsValidByNo, saveLocationWithCarInfo } from "@/api/WipStorage";
import { mapGetters } from 'vuex';
import UnbindActionPDA from './unbindActionPDA.vue';
export default {
    name: 'actionWipStorage',
    components: { DemoBlock,UnbindActionPDA },
    computed: {
     ...mapGetters(['userid'])
    },
    data() {
        return {
            active: 0,
            bangdingActive: 0,
            //#region 绑定界面的数据
            bangdingCarNo0: '',
            bangdingMagazine0: '',
            tableMagazineData: [],
            checkBangdingMagazineFlag: false,
            bangdingLocation0: '',
            bangdingFullMagazineCarNo0: '',
            checkBangdingLocationFlag: false,
            checkAllPassBangdingLocationFlag: false,
            //#endregion
        }
    },
    watch: {
        active(newVal,oldVal){
            if (newVal!==oldVal) {
                this.bangdingOnclick();
            }
        }
    },
    created() {
        //console.log(this.$refs);
    },
    mounted() {
        this.$nextTick(() => {
            //console.log(this.$refs.bangdingCarNo0);
            // 在这里可以操作 this.$refs.bangdingCarNo0
            switch (this.bangdingActive) {
                case "00":
                    this.$refs.bangdingCarNo0.focus();
                    break;
                case "01":
                    this.$refs.bangdingLocation0.focus();
                    break;
                default:
                    break;
            }
        });
    },
    methods: {
        //#region  绑定界面的方法
        bangdingOnclick(name, title) {
            this.$nextTick(() => {
                // 在这里可以操作 this.$refs.bangdingCarNo0
                switch (this.bangdingActive) {
                    case "00":
                        this.$refs.bangdingCarNo0.focus();
                        break;
                    case "01":
                        this.$refs.bangdingLocation0.focus();
                        break;
                    default:
                        break;
                }
            });
        },
        checkbangdingCarNo0() { // 验证车是否可用
            if (this.bangdingCarNo0 === '') {
                Notify({ type: 'danger', message: '请扫入小车二维码信息' });
                return;
            }
            this.bangdingCarNo0 = this.bangdingCarNo0.toUpperCase();
            checkCarIsFullByCarNo(this.bangdingCarNo0).then(res => {
                if (res.success) {
                    this.checkBangdingMagazineFlag = true;
                    this.$refs.bangdingMagazine0.focus();
                    if (res.data.length > 0) {
                        res.data.forEach(item => {
                            this.tableMagazineData.push({ magazineNo: item.magazineNo, type: 'old' })
                        });
                        Notify({ type: 'success', message: res.msg });
                        return;
                    }
                    return;
                } else {
                    Notify({ type: 'danger', message: this.bangdingCarNo0 + "---" + res.msg });
                    this.bangdingCarNo0 = '';
                    return;
                }
            })
        },
        checkBangdingMagazine0() { // 验证magazine是否可用
            if (this.bangdingMagazine0 === '') {
                Notify({ type: 'danger', message: '请扫入小车二维码信息' });
                return;
            }
            if (this.tableMagazineData.length >= 4) {

                Notify({ type: 'danger', message: '该车已满,请确认提交数据！' });
                this.bangdingMagazine0 = '';
                return;
            }
            this.bangdingMagazine0 = this.bangdingMagazine0.toUpperCase();
            checkMagazineIsValidByNo(this.bangdingMagazine0).then(res => {
                if (res.success) {
                    let flag = false;
                    if (this.tableMagazineData.length > 0) {
                        this.tableMagazineData.forEach(item => {
                            if (item.magazineNo === this.bangdingMagazine0) {
                                flag = true;
                                Notify({ type: 'danger', message: "数据列表已存在" + this.bangdingMagazine0 + ",请注意！" });
                            }
                        })
                    }
                    if (!flag) {
                        Notify({ type: 'success', message: res.msg });
                        this.tableMagazineData.push({ magazineNo: this.bangdingMagazine0, type: 'new' });
                    }
                    this.bangdingMagazine0 = '';
                    this.$refs.bangdingMagazine0.focus();
                    return;
                } else {
                    Notify({ type: 'danger', message: res.msg });
                    this.bangdingMagazine0 = '';
                    return;
                }
            })
        },
        bangdingMagazineReplay() { // 重置小车与magazine的界面数据
            this.bangdingCarNo0 = '';
            this.bangdingMagazine0 = '';
            this.tableMagazineData = [];
            this.checkBangdingMagazineFlag = false;
        },
        bangdingLocationReplay() {
            this.bangdingLocation0 = '';
            this.bangdingFullMagazineCarNo0 = '';
            this.checkBangdingLocationFlag = false;
            this.checkAllPassBangdingLocationFlag = false;
        },
        handleMagazineDelete(row) {
            this.tableMagazineData.shift(row.magazineNo)
        },
        handleBangdingMagazineData() { // 保存magazine与car的提交数据
            Dialog.confirm({
                title: '提交数据',
                message: '请确认数据正确',
            }).then(() => {
                // on confirm
                let infoList = [];
                this.tableMagazineData.forEach(item => {
                    if (item.type === 'new') {
                        infoList.push({
                            magazineNo: item.magazineNo,
                            wipCarNo: this.bangdingCarNo0,
                            createBy: this.userid,
                            updateBy: this.userid
                        });
                    }
                })
                if (infoList.length === 0) {
                    Notify({ type: 'danger', message: '请勿提交空数据' });
                } else {
                    saveCarWithMagazineInfo(infoList).then(res => {
                        if (res.success) {
                            this.bangdingMagazineReplay();
                            Notify({ type: 'success', message: res.msg, duration:5000 });
                        } else {
                            Notify({ type: 'danger', message: res.msg });
                        }
                    })
                }
            }).catch(() => {
                // on cancel
            });
        },
        checkBangdingLoction0() { // 验证库位是否可用
            if (this.bangdingLocation0 === '') {
                Notify({ type: 'danger', message: '请扫入库位二维码信息' });
                return;
            }
            this.bangdingLocation0 = this.bangdingLocation0.toUpperCase();
            checkLoctionIsValidByNo(this.bangdingLocation0).then(res => {
                if (res.success) {
                    Notify({ type: 'success', message: res.msg });
                    this.checkBangdingLocationFlag = true;
                    this.$refs.bangdingFullMagazineCarNo0.focus();
                } else {
                    Notify({ type: 'danger', message: res.msg });
                    this.bangdingLocation0 = '';
                }
            })
        },
        checkBangdingFullMagazineCarNo0() { // 验证是否车可以绑定该库位
            if (this.bangdingFullMagazineCarNo0 === '') {
                Notify({ type: 'danger', message: '请扫入小车二维码信息' });
                return;
            }
            this.bangdingFullMagazineCarNo0 = this.bangdingFullMagazineCarNo0.toUpperCase();
            checkFullMagazineCarIsValidByNo(this.bangdingFullMagazineCarNo0).then(res => {
                if (res.success) {
                    Notify({ type: 'success', message: res.msg });
                    this.checkAllPassBangdingLocationFlag = true;
                } else {
                    Notify({ type: 'danger', message: res.msg });
                    this.bangdingFullMagazineCarNo0 = '';
                }
            })
        },
        handleBangdingLocationData() {
            Dialog.confirm({
                title: '提交数据',
                message: '请确认数据正确',
            }).then(() => {
                // on confirm
                saveLocationWithCarInfo({
                    locationNo: this.bangdingLocation0,
                    wipCarNo: this.bangdingFullMagazineCarNo0,
                    createBy: this.userid,
                    updateBy: this.userid
                }).then(res => {
                    if (res.success) {
                        this.bangdingLocationReplay();
                        Notify({ type: 'success', message: res.msg});
                    } else {
                        Notify({ type: 'danger', message: res.msg });
                    }
                })
            }).catch(() => {
                // on cancel
            });
        }
        //#endregion




    }
}
</script>

<style lang="scss" scoped>
.button-group {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    /* 将容器分成两列 */
    grid-gap: 10px;
    /* 两个按钮之间的间隔 */
}
</style>