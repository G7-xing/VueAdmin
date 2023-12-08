<template >
    <div>
        <el-card :body-style="{ padding: '2px' }" shadow="always">
            <van-field v-model="partNumber" ref="partNumber" center clearable label-align="left" label="PCBA料号"
                placeholder="请扫入料号PartNumber" @keydown.enter.native="queryPartNumber()" label-width="4.2rem"
                :disabled="queryPartNumberFlag">
                <template #button>
                    <div class="button-group">
                        <van-button size="small" round type="primary" @click="queryPartNumber()" >搜索</van-button>
                        <van-button size="small" round type="warning" @click="queryPartNumberReplay()">清空</van-button>
                    </div>
                </template>
            </van-field>
        </el-card>
        <div v-show="queryPartNumberFlag">
            <DemoBlock>Magazine在库列表PartNumber:{{ partNumber }}</DemoBlock>
            <el-card :body-style="{ padding: '0px' }" shadow="always">
                <el-table :data="inMagazineData" style="width: 100%" size="mini" :header-cell-style="{ color: '#07c160', }"
                    :cell-style="{ 'line-height': '2px' }" border>
                    <el-table-column label="WipIn时间" align="center">
                        <template slot-scope="scope">{{ scope.row.date }}</template>
                    </el-table-column>
                    <el-table-column label="车/库位" align="center">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" placement="top">
                                <div slot="content">区域: {{ scope.row.areaName }}</div>
                                <el-tag size="medium">{{ scope.row.carOfLocaipon }}</el-tag>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column label="Magazine" align="center">
                        <template slot-scope="scope">{{ scope.row.magazine }}</template>
                    </el-table-column>
                </el-table>
            </el-card>
        </div>
    </div>
</template>   
<script>
import { Notify, Dialog } from 'vant';
import DemoBlock from '@/components/DemoBlock';
import { getInStorageDataByPcbaNo } from "@/api/WipStorage";
export default {
    name: 'queryByPartNumber',
    props: ['active', 'userid'],
    components: { DemoBlock },
    data() {
        return {
            partNumber: '',
            inMagazineData: [],
            queryPartNumberFlag: false

        }
    },
    watch: {
        active(newVal, oldVal) {
            // console.log(newVal, oldVal);
            //监控父组件的值
            if (newVal === 2) {
                this.$nextTick(() => {
                    this.$refs.partNumber.focus();
                })
            }
        }
    },
    methods: {
        queryPartNumber() {
            if (this.partNumber === '') {
                Notify({ type: 'danger', message: '请输入PCBA料号' })
            }
            getInStorageDataByPcbaNo(this.partNumber).then(res => {
                if (res.success) {
                    this.inMagazineData=[];
                        res.data.forEach(element => {
                            let obj = {};
                            obj.date = element.minDate;
                            obj.carOfLocaipon = element.wipCarNo +'-'+element.locationNo;
                            obj.magazine = element.magazineNo;
                            obj.areaName = element.areaName;
                            this.inMagazineData.push(obj);
                        });
                        this.queryPartNumberFlag = true;
                        Notify({ type: 'success', message: res.msg });
                    } else {
                        Notify({ type: 'danger', message: res.msg });
                    }
            })
            
        },
        queryPartNumberReplay() {
            this.queryPartNumberFlag = false;
            this.partNumber = '';
            this.inMagazineData = [];
        },
    },
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