<template>
    <div>

        <div v-if="pageKey === 0">
            <el-card>
                <DemoBlock>线体选择</DemoBlock>
                <van-row type="flex" justify="center">
                    <van-col span="6" v-for="item in lineInfo" :key="item.lineId">
                        <van-checkbox-group v-model="lineCheckboxs" direction="horizontal">
                            <van-checkbox :name="item.lineName" style="margin: 5px;">{{ item.lineName }}</van-checkbox>
                        </van-checkbox-group>
                    </van-col>
                </van-row>
            </el-card>
            <div class="table-container">
                <el-table ref="smtTable" :data="list" row-key="pickOrderId" style="width: 100%;" size="small" height="700"
                    :header-cell-style="{ background: '#304156', color: '#FFFFFF' }" :cell-style="{ color: '#606266' }"
                    @row-click="clickRow" v-loading="listLoading" border>
                    <el-table-column label="PickOrder" align="center" width="160">
                        <template slot-scope="scope">{{ scope.row.pickOrderId }}</template>
                    </el-table-column>
                    <el-table-column label="PartNumber" align="center" width="100">
                        <template slot-scope="scope">{{ scope.row.partNumber }}</template>
                    </el-table-column>
                    <el-table-column label="SMTLine" align="center">
                        <template slot-scope="scope">{{ scope.row.line }}</template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div v-else-if="pageKey === 1">
            <van-nav-bar :title="rowTilte" left-text="返回" left-arrow @click-left="onClickLeft" />
            <el-card class="box-card">
                <van-field v-model="barcode" ref="barcode" center clearable label-align="left" label="Barcode:"
                    placeholder="请扫入barcode" @keydown.enter.native="handleBarcode()" label-width="4.0rem">
                </van-field>
            </el-card>
            <div class="table-container">
                <el-table ref="detailTable" :data="detailData" style="width: 100%;" size="mini" height="700"
                    :header-cell-style="{ background: '#304156', color: '#FFFFFF' }" :cell-style="{ color: '#606266' }"
                    border>
                    <el-table-column label="PartNumber" align="center" width="60">
                        <template slot-scope="scope">{{ scope.row.partNumber }}</template>
                    </el-table-column>
                    <el-table-column label="BatchNumber" align="center" width="75">
                        <template slot-scope="scope">{{ scope.row.batchNo }}</template>
                    </el-table-column>
                    <el-table-column label="Inventory" align="center" width="78">
                        <template slot-scope="scope">{{ scope.row.inventory }}</template>
                    </el-table-column>
                    <el-table-column label="UniqueId" align="center">
                        <template slot-scope="scope">{{ scope.row.uniqueId }}</template>
                    </el-table-column>
                    <el-table-column label="Side" align="center" width="50">
                        <template slot-scope="scope">{{ scope.row.smtSide }}</template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
import DemoBlock from '@/components/DemoBlock';
import { getLineListByCategory } from '@/api/line';
import { fetchMPSofLineList, fetchMPSDetailById, handleQADAndMPS } from '@/api/MPSKanban';
import { Toast } from 'vant';
import { barCodeTrans } from '@/utils/index';
import { mapGetters } from 'vuex';
export default {
    name: 'SMTMPSPDA',
    components: { DemoBlock },
    data() {
        return {
            textToSpeak: '',
            pageKey: 0, // 默认第一个page,1是detail
            lineCheckboxs: ["SMT06"],
            list: [],
            detailData: [],
            lineInfo: [],
            listLoading: false,
            time: '',
            rowTilte: '',
            barcode: '',
            transUniqueId: '',
        }
    },

    created() {
        getLineListByCategory('SMT').then(res => this.lineInfo = res.data);
        this.getList();
    },
    watch: {
        lineCheckboxs() {
            // 监控checkline
            this.getList();
        }
    },
    computed: {
        ...mapGetters(['userid'])
    },
    mounted() {
        //开启定时器
        this.timer = setInterval(this.getList, 5 * 60 * 1000); // 5min
    },
    beforeDestroy() {
        // 移除监听全屏事件
        clearInterval(this.timer);// 移除该循环定时器
    },
    methods: {
        speak(text) {
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(text);
                speechSynthesis.speak(utterance);
            } else {
                console.error('不支持语音合成');
            }
        },
        // playSiren() {

        //     const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        //     const oscillator = audioContext.createOscillator();
        //     oscillator.type = 'square';
        //     oscillator.frequency.setValueAtTime(1000, audioContext.currentTime); // 设置频率为 1000Hz
        //     oscillator.connect(audioContext.destination);
        //     oscillator.start();
        //     setTimeout(() => {
        //         oscillator.stop();
        //     }, 500); // 播放 0.5 秒后停止
        // },
        onClickLeft() {
            this.pageKey = 0;
        },
        // 获取表格数据
        getList() {
            this.listLoading = true;
            fetchMPSofLineList(this.lineCheckboxs).then(res => {
                res.success ?
                    this.list = res.data : this.$message.error(res.msg);
                this.listLoading = false;
            })
        },
        clickRow(row, column, event) {
            //console.log(row, column, event);
            this.pageKey = 1;
            this.rowTilte = row.pickOrderId;
            fetchMPSDetailById(this.rowTilte).then(res => {
                res.success ?
                    this.detailData = res.data : this.$message.error(res.msg);
            })
        },
        handleBarcode() {
            debugger
            let resultCode = barCodeTrans(this.barcode);
            if (resultCode.transUniqueId) {
                let transUniqueId = resultCode.transUniqueId;
                let rawPartNumber = resultCode.rawPartNumber;
                if (this.detailData.filter(x => x.partNumber === rawPartNumber)) {
                    if (this.detailData.filter(x => x.uniqueId === transUniqueId)) {
                        Toast("Exists-" + UniqueId);
                        this.speak("已扫入该信息");
                    } else {
                        // QAD 移库--> 移库成功则更新
                        let obj = {};
                        obj.pickOrderId = this.rowTilte;
                        obj.rawPartNumber = rawPartNumber;
                        obj.uniqueId = transUniqueId;
                        obj.barcode = this.barcode;
                        obj.userid = this.userid;
                        handleQADAndMPS(obj).then(res => {
                            if (res.success) {
                                Toast(res.msg);
                                fetchMPSDetailById(this.rowTilte).then(res => {
                                    if (res.success) {
                                        if (res.data !== null) {
                                            this.detailData = res.data
                                        } else {
                                            this.barcode = '';
                                            this.pageKey = 0;
                                        }
                                    }
                                });
                                this.barcode = '';
                                Toast(res.msg);
                            } else {
                                this.barcode = '';
                                Toast(res.msg);
                            }
                        })
                    }
                } else {
                    this.barcode = '';
                    Toast(rawPartNumber + " does not exist!");
                    this.speak("物料不存在");
                }
            } else {
                this.barcode = '';
                Toast("Scanned Incorrect Barcode");
                this.speak("扫入错误信息");
            }
        }

    },
}
</script>

<style lang="scss" scoped>
::v-deep .el-card__body {
    padding: 0px;
}
</style>