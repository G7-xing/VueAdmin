<template >
    <div>
        <el-card :body-style="{ padding: '5px' }" shadow="always">
            <van-field  v-model="unbindLocation0" ref="unbindLocation0" center clearable label-align="right"
                label="库位(Location):" :disabled="checkunbindLocationFlag" placeholder="请扫入库位二维码信息" 
                @keydown.enter.native="checkUnbindLocation0()" label-width="7.5rem">
            </van-field>
        </el-card>
        <div class="button-group" v-show="checkunbindLocationFlag">
            <van-button icon="records" type="primary" @click="handleUnbindLocationData()">提交</van-button>
            <van-button icon="replay" @click="unbindLocationReplay()" type="warning">重置</van-button>
        </div>
    </div>
</template>   
<script>
import { Notify, Dialog } from 'vant';
import { checkUnbindLocationIsValidByNo, unbindLocationWithCarInfo } from "@/api/WipStorage";
export default {
    name: 'unbindActionPDA',
    props: ['active', 'userid'],
    data() {
        return {
            unbindActive: 0,
            unbindLocation0: '',
            checkunbindLocationFlag: false
        }
    },
    watch: {
        active(newVal, oldVal) {
            // console.log(newVal, oldVal);
            //监控父组件的值
            if (newVal === 1) {
                this.$nextTick(() => {
                    this.$refs.unbindLocation0.focus();
                })
            }
        }
    },
    methods: {
        checkUnbindLocation0() {
            checkUnbindLocationIsValidByNo(this.unbindLocation0.toUpperCase()).then(res => {
                if (res.success) {
                    this.checkunbindLocationFlag = true;
                    Notify({ type: 'success', message: res.msg });
                } else {
                    Notify({ type: 'danger', message: this.unbindLocation0 + "---" + res.msg });
                    this.unbindLocation0 = '';
                }
            })
        },
        handleUnbindLocationData() {
            Dialog.confirm({
                title: '提交数据',
                message: '请确认数据正确',
            }).then(() => {
                // on confirm
                unbindLocationWithCarInfo({
                    locationNo: this.unbindLocation0.toUpperCase(),
                    updateBy: this.userid
                }).then(res => {
                    if (res.success) {
                        this.unbindLocationReplay();
                        Notify({ type: 'success', message: res.msg });
                    } else {
                        Notify({ type: 'danger', message: res.msg });
                    }
                })
            }).catch(() => {
                // on cancel
            });
        },
        unbindLocationReplay() {
            this.checkunbindLocationFlag = false;
            this.unbindLocation0 = '';
        },
    },
}
</script>
<style lang="scss">
.button-group {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    /* 将容器分成两列 */
    grid-gap: 10px;
    /* 两个按钮之间的间隔 */
}
</style>