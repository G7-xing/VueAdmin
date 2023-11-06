<template>
    <div class="app-container">
        <el-card class="filter-container" shadow="never">
            <div style="margin-top: -10px;">
                <i class="el-icon-search"></i>
                <span>{{ "\u3000" }}筛选搜索</span>
            </div>
            <div style="margin: 10px 10px -10px 0px;">
                <el-form :inline="true" :model="alllistQuery" size="medium" class="demo-form-inline" label-position="right"
                    :label-width="fromLaberWidth">
                    <el-form-item label="Line Name[线别]:">
                        <el-select v-model="alllistQuery.listQuery.lineId" filterable default-first-option clearable
                            style="width: 13rem;" placeholder="请选择线别">
                            <el-option v-for="item in lineList" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Component Number[原材料料号]:">
                        <el-input v-model="alllistQuery.listQuery.componentNumber" placeholder="请输入原材料料号"
                            style="width: 13rem;"></el-input>
                    </el-form-item>
                    <el-form-item label="Pickup Status[配料状态]:">
                        <el-select v-model="alllistQuery.listQuery.pickupStatus" clearable placeholder="请选择配料状态"
                            style="width: 13rem;">
                            <el-option v-for="item in pickupStatusOptions" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Pick Order Type[需求单类型]:">
                        <el-select v-model="alllistQuery.listQuery.pickOrderType" clearable placeholder="请选择需求单类型"
                            style="width: 13rem;">
                            <el-option v-for="item in pickOrderTypeOptions" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Pickup Time[备料时间]:">
                        <el-date-picker v-model="alllistQuery.listQuery.pickupTime" type="datetime" placeholder="请选择备料时间"
                            align="right" :picker-options="pickerOptions" style="width: 13rem;">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="Unique ID[CFM批次号]:">
                        <el-input v-model="alllistQuery.listQuery.pcbaNumber" placeholder="请输入CFM批次号"
                            style="width: 13rem;"></el-input>
                    </el-form-item>
                    <el-button type="primary" @click="handleSearchList()" round size="small">
                        <i class="el-icon-search"></i>搜索
                    </el-button>
                    <el-button type="info" @click="handleResetSearch()" round size="small">
                        <i class="el-icon-refresh-left"></i>重置
                    </el-button>
                </el-form>
            </div>
        </el-card>
        <div class="table-container" style="margin-top: 2rem;">
            <vxe-table resizable show-overflow ref="xTable" border :loading="loading" :data="tableData" :row-config="{isCurrent: true, isHover: true}"  height="550">
                <vxe-column type="seq" width="60"></vxe-column>
                <vxe-column field="pickOrderId" title="Pick Order[物料需求订单]"></vxe-column>
                <vxe-column field="line" title="Line[线别]"></vxe-column>
                <vxe-column field="productNumber" title="Product Number[PCBA料号]"></vxe-column>
                <vxe-column field="workOrder" title="Work Order[工单]"></vxe-column>
                <vxe-column field="componentNumber" title="ComponentNumber[原材料料号]"></vxe-column>
                <vxe-column field="uniqueId" title="UniqueID[CFM批次号]"></vxe-column>
                <vxe-column field="createdTime" title="Order Time[订单时间]"></vxe-column>
                <vxe-column field="pickupTime" title="Pickup Time[配料时间]"></vxe-column>
                <vxe-column field="PickOrderType" title="Order Type[订单类型]">
                    <template #default="{ row }">
                        <span v-if="row.PickOrderType === '4'">Auto</span>
                        <span v-else-if="row.PickOrderType === '5'">Manual</span>
                        <span v-else>Not Defined</span>
                    </template>
                </vxe-column>
                <vxe-column field="pickupStatus" title="Pickup Status[配料状态]">
                    <template #default="{ row }">
                        <span v-if="row.pickStatus == '10'">Opened</span>
                        <span v-else-if="row.pickStatus == '20'">Picked</span>
                        <span v-else-if="row.pickStatus == '30'">Completed</span>
                        <span v-else-if="row.pickStatus == '40'">Transfer</span>
                        <span v-else-if="row.pickStatus == '50'">Received</span>
                        <span v-else-if="row.pickStatus == '-10'">Closed</span>
                        <span v-else-if="row.pickStatus == '-20'">Cancelled</span>
                    </template>
                </vxe-column>
                <vxe-column field="track" title="Track[Track]"></vxe-column>
                <vxe-column field="batchNumber" title="DateCode[DateCode]"></vxe-column>
                <vxe-column field="inventory" title="Inventory[仓库库位]"></vxe-column>
                <vxe-column field="smtMachine" title="Machine[机台]"></vxe-column>
                <vxe-column field="smtSide" title="Side[内外侧]"></vxe-column>
            </vxe-table>
            <div class="pagination-container">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    layout="total, sizes,prev, pager, next,jumper" :current-page.sync="alllistQuery.pageNum"
                    :page-size="alllistQuery.pageSize" :page-sizes="[10, 15, 20]" :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import { fetchAllList } from '@/api/line';
const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    listQuery: {
        pickOrderNumber: null,
        pcbaNumber: null,
        createdTime: null,
        pickOrderType: null,
        pickOrderStatus: null,
        lineId: null,
    }
};
export default {
    name: 'PickupReport',
    data() {
        return {
            tableData: [
                { id: 10001, name: 'Test1', role: 'Develop', sex: '0', age: 28, address: 'test abc' },
                { id: 10002, name: 'Test2', role: 'Test', sex: '1', age: 22, address: 'Guangzhou' },
                { id: 10003, name: 'Test3', role: 'PM', sex: '0', age: 32, address: 'Shanghai' },
                { id: 10004, name: 'Test4', role: 'Designer', sex: '1', age: 23, address: 'test abc' },
                { id: 10005, name: 'Test5', role: 'Develop', sex: '1', age: 30, address: 'Shanghai' },
                { id: 10006, name: 'Test6', role: 'Designer', sex: '1', age: 21, address: 'test abc' }
            ],
            pickerOptions: {
                shortcuts: [
                    {
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    },
                    {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    },
                    {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
            },
            pickOrderTypeOptions: [
                {
                    label: "Auto",
                    value: "4"
                },
                {
                    label: "Manual",
                    value: "5"
                },
            ],
            pickupStatusOptions: [
                {
                    label: "Open",
                    value: "10"
                },
                {
                    label: "Closed",
                    value: "-10"
                },
                {
                    label: "Picked",
                    value: "20"
                },
                {
                    label: "Cancelled",
                    value: "-20"
                },
                {
                    label: "Completed",
                    value: "30"
                },
                {
                    label: "Transfer",
                    value: "40"
                },
                {
                    label: "Received",
                    value: "50"
                },
            ],
            alllistQuery: Object.assign({}, defaultListQuery),
            lineList: [],
            fromLaberWidth: '15.78rem',
            total: 9,
            loading: false,
        }
    },
    created() {
        this.getLineList();
    },
    methods: {
        handleSearchList() {
            this.alllistQuery.pageNum = 1;
            //this.fetchList();
        },
        handleResetSearch() {
            this.alllistQuery.listQuery = {};
        },
        // toggleExpandMethod({ expanded, row }) {

        //     return true
        // },
        handleSizeChange(val) {
            this.alllistQuery.pageNum = 1;
            this.alllistQuery.pageSize = val;
            // this.fetchList();
        },
        handleCurrentChange(val) {
            this.alllistQuery.pageNum = val;
            //this.fetchList();
        },
        getList() {
            this.listLoading = true;
            fetchHistoryList(this.alllistQuery).then(response => {
                debugger
                const { data, total } = response.data;
            });
        },

        /**
         * 获取线体只保留smt
         * @returns {Promise<void>}
         */
        getLineList() {
            fetchAllList().then(res => {
                if (res.success) {
                    res.data.forEach(element => {
                        let value = element.lineId;
                        if (element.lineName.includes('SMT')) {
                            let label = element.lineName;
                            this.lineList.push({ value, label });
                        }

                    });
                }
            })
        },

    },
}
</script>
<style lang="scss">
.expand-wrapper {
    padding: 20px;
}

.pagination-container {
    margin-top: 10px;
    padding-bottom: 30px;
}
</style>